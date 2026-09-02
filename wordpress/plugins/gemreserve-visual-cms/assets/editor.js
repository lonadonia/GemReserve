/**
 * GemReserve Visual CMS — block editor.
 *
 * Written against the `wp.*` globals with no build step. That is a deliberate
 * choice rather than a shortcut: §28 of the brief requires the deployment
 * package to be reproducible from committed source, and a file that ships as it
 * was written satisfies that with nothing to reproduce. Adding @wordpress/
 * scripts would have pulled several hundred megabytes of toolchain into a
 * Next.js repository that has no other use for it, produced a build artefact
 * that has to be trusted or rebuilt, and widened the supply chain — for JSX.
 *
 * The design goal, from §9: a marketing user must be able to see the page,
 * point at a thing, and change it. Not fill in a form that claims to correspond
 * to the page. So each block renders its real markup, against the real
 * stylesheet, and text is edited in place. The sidebar carries the things that
 * genuinely are not in-place edits — image choice, link destination, icon.
 */
(function (wp) {
	'use strict';

	if (!wp || !wp.blocks || !wp.element) {
		return;
	}

	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var useRef = wp.element.useRef;
	var useEffect = wp.element.useEffect;
	var useState = wp.element.useState;
	var __ = wp.i18n.__;

	var blockEditor = wp.blockEditor;
	var components = wp.components;
	var useBlockProps = blockEditor.useBlockProps;
	var useInnerBlocksProps = blockEditor.useInnerBlocksProps;
	var InspectorControls = blockEditor.InspectorControls;
	var BlockControls = blockEditor.BlockControls;
	var MediaUpload = blockEditor.MediaUpload;
	var MediaUploadCheck = blockEditor.MediaUploadCheck;

	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var ToggleControl = components.ToggleControl;
	var Button = components.Button;
	var Notice = components.Notice;
	var ToolbarGroup = components.ToolbarGroup;
	var ToolbarButton = components.ToolbarButton;

	var SETTINGS = window.gemreserveVcms || {};
	var ICONS = SETTINGS.icons || [];

	/* ------------------------------------------------------------------ */
	/* Template rendering                                                  */
	/* ------------------------------------------------------------------ */

	// Must match SlotEngine::OPEN exactly. The underscore rather than a colon
	// is deliberate — see the comment on that constant.
	var PLACEHOLDER = /\{\{gr_([A-Za-z0-9_]+)\}\}/g;

	function escapeText(value) {
		return String(value === null || value === undefined ? '' : value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	function escapeAttr(value) {
		return String(value === null || value === undefined ? '' : value)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;');
	}

	/**
	 * Fill a template for display in the editor canvas.
	 *
	 * Text slots are wrapped in an editable span so the user can click the words
	 * on the page and retype them. Those spans are editor-only chrome — the
	 * server renderer substitutes the same slots with no wrapper, which is why
	 * the published markup stays byte-identical to the approved design.
	 */
	function fillTemplate(template, slots, values, editable) {
		var byKey = {};
		(slots || []).forEach(function (slot) {
			byKey[slot.key] = slot;
		});

		return String(template || '').replace(PLACEHOLDER, function (match, key) {
			var slot = byKey[key];
			if (!slot) {
				return '';
			}
			var value = values && Object.prototype.hasOwnProperty.call(values, key)
				? values[key]
				: slot.value;

			if (slot.kind === 'icon') {
				return String(value || '');
			}
			if (slot.kind === 'url' || slot.kind === 'attr') {
				return escapeAttr(value);
			}
			if (!editable) {
				return escapeText(value);
			}

			var empty = String(value || '').trim() === '';
			return (
				'<span class="gr-slot' + (empty ? ' gr-slot--empty' : '') + '"' +
				' data-gr-slot="' + escapeAttr(key) + '"' +
				' role="textbox" tabindex="0"' +
				' aria-label="' + escapeAttr(slot.label || __('Text', 'gemreserve-visual-cms')) + '"' +
				' contenteditable="true" spellcheck="true">' +
				escapeText(value) +
				'</span>'
			);
		});
	}

	/**
	 * Render markup into a node and wire up in-place editing.
	 *
	 * innerHTML is set imperatively rather than through dangerouslySetInnerHTML
	 * so React never re-renders over a field the user is mid-sentence in. The
	 * effect re-runs only when the template or the *shape* of the values changes,
	 * not on every keystroke.
	 */
	function useLiveMarkup(html, onSlotChange) {
		var ref = useRef(null);

		useEffect(function () {
			var node = ref.current;
			if (!node) {
				return undefined;
			}
			if (node.innerHTML !== html) {
				node.innerHTML = html;
			}
			if (!onSlotChange) {
				return undefined;
			}

			var handleInput = function (event) {
				var target = event.target.closest('[data-gr-slot]');
				if (!target) {
					return;
				}
				onSlotChange(target.getAttribute('data-gr-slot'), target.textContent);
			};

			// Enter would insert a <div> or <br> into a slot whose value is a
			// plain string. Blur instead: the edit is already saved on input.
			var handleKey = function (event) {
				if (event.key === 'Enter' && event.target.closest('[data-gr-slot]')) {
					event.preventDefault();
					event.target.blur();
				}
			};

			// A link inside an editable region would navigate away from the
			// editor on click. Selecting it to edit the words is what is wanted.
			var handleClick = function (event) {
				var anchor = event.target.closest('a');
				if (anchor && node.contains(anchor)) {
					event.preventDefault();
				}
			};

			node.addEventListener('input', handleInput);
			node.addEventListener('keydown', handleKey);
			node.addEventListener('click', handleClick);

			return function () {
				node.removeEventListener('input', handleInput);
				node.removeEventListener('keydown', handleKey);
				node.removeEventListener('click', handleClick);
			};
		}, [html, onSlotChange]);

		return ref;
	}

	/**
	 * Parse a stored start tag into something React can create.
	 *
	 * Used so a section renders inside its real element with its real classes,
	 * which is what lets the site stylesheet style the editor canvas.
	 */
	function parseOpenTag(open, fallbackTag) {
		var result = { tag: fallbackTag || 'div', props: {} };
		var match = /^<([a-zA-Z][a-zA-Z0-9-]*)([\s\S]*?)\/?>$/.exec(String(open || '').trim());
		if (!match) {
			return result;
		}
		result.tag = match[1].toLowerCase();

		var attrPattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"/g;
		var attr;
		while ((attr = attrPattern.exec(match[2])) !== null) {
			var name = attr[1].toLowerCase();
			var value = attr[2];
			// Event handlers are never reproduced in the editor canvas, and the
			// approved markup contains none.
			if (name.indexOf('on') === 0) {
				continue;
			}
			if (name === 'class') {
				result.props.className = value;
			} else if (name === 'style') {
				result.props.style = parseStyle(value);
			} else {
				result.props[name] = value;
			}
		}
		return result;
	}

	function parseStyle(value) {
		var out = {};
		String(value).split(';').forEach(function (pair) {
			var at = pair.indexOf(':');
			if (at < 1) {
				return;
			}
			var prop = pair.slice(0, at).trim();
			var val = pair.slice(at + 1).trim();
			if (!prop) {
				return;
			}
			// Custom properties must be passed through verbatim; the animation
			// delays in this design are all --reveal-delay.
			if (prop.indexOf('--') === 0) {
				out[prop] = val;
				return;
			}
			out[prop.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); })] = val;
		});
		return out;
	}

	/* ------------------------------------------------------------------ */
	/* Shared slot editing controls                                        */
	/* ------------------------------------------------------------------ */

	function IconPicker(props) {
		var state = useState(false);
		var open = state[0];
		var setOpen = state[1];

		return el(
			'div',
			{ className: 'gr-icon-picker' },
			el('div', { className: 'gr-icon-picker__current' }, [
				el('span', {
					key: 'preview',
					className: 'gr-icon-picker__preview',
					dangerouslySetInnerHTML: { __html: props.value || '' }
				}),
				el(
					Button,
					{
						key: 'change',
						variant: 'secondary',
						onClick: function () { setOpen(!open); }
					},
					open ? __('Close', 'gemreserve-visual-cms') : __('Change icon', 'gemreserve-visual-cms')
				)
			]),
			open
				? el(
					'div',
					{ className: 'gr-icon-picker__grid' },
					ICONS.length
						? ICONS.map(function (icon, index) {
							return el(Button, {
								key: index,
								className: 'gr-icon-picker__option',
								label: icon.label,
								showTooltip: true,
								onClick: function () {
									props.onChange(icon.svg);
									setOpen(false);
								}
							}, el('span', { dangerouslySetInnerHTML: { __html: icon.svg } }));
						})
						: el('p', { className: 'gr-icon-picker__empty' },
							__('No icons are available in the shared set.', 'gemreserve-visual-cms'))
				)
				: null
		);
	}

	function ImageControl(props) {
		return el(
			MediaUploadCheck,
			{},
			el(MediaUpload, {
				allowedTypes: ['image', 'video'],
				value: undefined,
				onSelect: function (media) {
					if (media && media.url) {
						props.onChange(media.url, media);
					}
				},
				render: function (openArgs) {
					return el('div', { className: 'gr-media-control' }, [
						props.value
							? el('img', {
								key: 'thumb',
								className: 'gr-media-control__thumb',
								src: props.value,
								alt: ''
							})
							: null,
						el(Button, {
							key: 'choose',
							variant: 'secondary',
							onClick: openArgs.open
						}, __('Choose from Media Library', 'gemreserve-visual-cms'))
					]);
				}
			})
		);
	}

	/**
	 * The sidebar controls for one set of slots.
	 *
	 * Text slots are omitted: they are edited on the page itself, and repeating
	 * them here as textboxes is exactly the "editor that is only a form" the
	 * brief warns against. What lands here is what genuinely cannot be typed
	 * in place — an image, a link target, an icon.
	 */
	function SlotFields(props) {
		var slots = props.slots || [];
		var values = props.values || {};

		var fields = slots.filter(function (slot) {
			return slot.kind !== 'text';
		});

		if (!fields.length) {
			return el('p', { className: 'gr-empty-note' },
				__('This part of the section has no images, links or icons. Edit its words directly on the page.', 'gemreserve-visual-cms'));
		}

		return el(Fragment, {}, fields.map(function (slot) {
			var value = Object.prototype.hasOwnProperty.call(values, slot.key)
				? values[slot.key]
				: slot.value;

			var onChange = function (next) {
				props.onChange(slot.key, next);
			};

			if (slot.kind === 'icon') {
				return el('div', { key: slot.key, className: 'gr-field' }, [
					el('span', { key: 'label', className: 'gr-field__label' }, slot.label),
					el(IconPicker, { key: 'picker', value: value, onChange: onChange })
				]);
			}

			if (slot.kind === 'url' && /(^|\/)[^/]*\.(png|jpe?g|webp|avif|gif|svg|mp4|webm)$/i.test(String(value || ''))) {
				return el('div', { key: slot.key, className: 'gr-field' }, [
					el('span', { key: 'label', className: 'gr-field__label' }, __('Image', 'gemreserve-visual-cms')),
					el(ImageControl, { key: 'media', value: value, onChange: onChange })
				]);
			}

			return el(TextControl, {
				key: slot.key,
				label: slot.label,
				value: value || '',
				onChange: onChange,
				help: slot.kind === 'url'
					? __('A page path such as /about, or a full https:// address.', 'gemreserve-visual-cms')
					: undefined,
				__nextHasNoMarginBottom: true
			});
		}));
	}

	/* ------------------------------------------------------------------ */
	/* Blocks                                                              */
	/* ------------------------------------------------------------------ */

	function hiddenToggle(attributes, setAttributes) {
		return el(ToggleControl, {
			label: __('Show this section on the site', 'gemreserve-visual-cms'),
			help: attributes.hidden
				? __('Hidden. It stays here for you to restore, but visitors and search engines will not see it.', 'gemreserve-visual-cms')
				: __('Visible to everyone.', 'gemreserve-visual-cms'),
			checked: !attributes.hidden,
			onChange: function (next) { setAttributes({ hidden: !next }); },
			__nextHasNoMarginBottom: true
		});
	}

	function EditSection(props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var parsed = parseOpenTag(attributes.open, 'section');

			var blockProps = useBlockProps({
				className: 'gr-section' + (attributes.hidden ? ' gr-section--hidden' : '')
			});
			var innerProps = useInnerBlocksProps(
				{ className: parsed.props.className, style: parsed.props.style },
				{ templateLock: false }
			);

			return el(Fragment, {}, [
				el(BlockControls, { key: 'toolbar' },
					el(ToolbarGroup, {},
						el(ToolbarButton, {
							icon: attributes.hidden ? 'hidden' : 'visibility',
							label: attributes.hidden
								? __('Show this section', 'gemreserve-visual-cms')
								: __('Hide this section', 'gemreserve-visual-cms'),
							isPressed: attributes.hidden,
							onClick: function () { setAttributes({ hidden: !attributes.hidden }); }
						})
					)
				),
				el(InspectorControls, { key: 'inspector' },
					el(PanelBody, { title: __('Section', 'gemreserve-visual-cms'), initialOpen: true }, [
						el(TextControl, {
							key: 'label',
							label: __('Name in the section list', 'gemreserve-visual-cms'),
							help: __('Only you see this. It makes the section easy to find in the list on the left.', 'gemreserve-visual-cms'),
							value: attributes.label || '',
							onChange: function (value) { setAttributes({ label: value }); },
							__nextHasNoMarginBottom: true
						}),
						el('div', { key: 'vis' }, hiddenToggle(attributes, setAttributes))
					])
				),
				el('div', Object.assign({ key: 'body' }, blockProps), [
					el('span', { key: 'chip', className: 'gr-section__chip', contentEditable: false },
						attributes.label || __('Section', 'gemreserve-visual-cms')),
					attributes.hidden
						? el('span', { key: 'flag', className: 'gr-section__flag', contentEditable: false },
							__('Hidden from the site', 'gemreserve-visual-cms'))
						: null,
					el(parsed.tag, Object.assign({ key: 'inner' }, innerProps))
				])
			]);
		}

	wp.blocks.registerBlockType('gemreserve/section', {
		edit: EditSection,
		save: function () { return el(blockEditor.InnerBlocks.Content); }
	});

	function EditWrapper(props) {
			var parsed = parseOpenTag(props.attributes.open, 'div');
			var blockProps = useBlockProps({ className: 'gr-wrapper' });
			var innerProps = useInnerBlocksProps(
				{ className: parsed.props.className, style: parsed.props.style },
				{ templateLock: false }
			);

			return el('div', blockProps, el(parsed.tag, innerProps));
		}

	wp.blocks.registerBlockType('gemreserve/wrapper', {
		edit: EditWrapper,
		save: function () { return el(blockEditor.InnerBlocks.Content); }
	});

	function EditContent(props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var slots = attributes.slots || [];

			var values = {};
			slots.forEach(function (slot) { values[slot.key] = slot.value; });

			var updateSlot = function (key, value) {
				setAttributes({
					slots: slots.map(function (slot) {
						return slot.key === key
							? Object.assign({}, slot, { value: value })
							: slot;
					})
				});
			};

			var html = fillTemplate(attributes.template, slots, values, true);
			var ref = useLiveMarkup(html, updateSlot);
			var blockProps = useBlockProps({ className: 'gr-content' });

			return el(Fragment, {}, [
				el(InspectorControls, { key: 'inspector' },
					el(PanelBody, { title: __('Images, links and icons', 'gemreserve-visual-cms'), initialOpen: true },
						el(SlotFields, { slots: slots, values: values, onChange: updateSlot })
					)
				),
				el('div', Object.assign({ key: 'body' }, blockProps),
					el('div', { className: 'gr-content__canvas', ref: ref })
				)
			]);
		}

	wp.blocks.registerBlockType('gemreserve/content', {
		edit: EditContent,
		save: function () { return null; }
	});

	function EditRepeatable(props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var itemSlots = attributes.itemSlots || [];
			var items = attributes.items || [];

			var selected = useState(0);
			var activeIndex = Math.min(selected[0], Math.max(items.length - 1, 0));
			var setActive = selected[1];

			var parsed = parseOpenTag(attributes.open, 'ul');

			function writeItems(next) {
				setAttributes({ items: next });
			}

			function updateItem(index, key, value) {
				writeItems(items.map(function (item, i) {
					return i === index ? Object.assign({}, item, defineOne(key, value)) : item;
				}));
			}

			function defineOne(key, value) {
				var o = {};
				o[key] = value;
				return o;
			}

			function addItem() {
				// A new card is a copy of the last one with its words cleared.
				// Cloning rather than starting blank keeps the icon and image, so
				// an editor gets a card that already looks right and only has to
				// type into it.
				var source = items.length ? items[items.length - 1] : {};
				var fresh = {};
				itemSlots.forEach(function (slot) {
					fresh[slot.key] = slot.kind === 'text' ? '' : (source[slot.key] || slot.value || '');
				});
				writeItems(items.concat([fresh]));
				setActive(items.length);
			}

			function duplicateItem(index) {
				var copy = items.slice();
				copy.splice(index + 1, 0, Object.assign({}, items[index]));
				writeItems(copy);
				setActive(index + 1);
			}

			function removeItem(index) {
				var copy = items.slice();
				copy.splice(index, 1);
				writeItems(copy);
				setActive(Math.max(0, index - 1));
			}

			function moveItem(index, delta) {
				var target = index + delta;
				if (target < 0 || target >= items.length) {
					return;
				}
				var copy = items.slice();
				var moved = copy.splice(index, 1)[0];
				copy.splice(target, 0, moved);
				writeItems(copy);
				setActive(target);
			}

			function itemTitle(item) {
				for (var i = 0; i < itemSlots.length; i++) {
					var slot = itemSlots[i];
					if (slot.kind === 'text') {
						var value = item[slot.key];
						if (value && String(value).trim()) {
							return String(value).trim().slice(0, 40);
						}
					}
				}
				return __('Untitled card', 'gemreserve-visual-cms');
			}

			// The canvas shows every card, exactly as the site draws them, with
			// each card's words editable in place.
			var canvasHtml = items.map(function (item, index) {
				return '<div class="gr-repeat-item' + (index === activeIndex ? ' is-active' : '') +
					'" data-gr-item="' + index + '">' +
					fillTemplate(attributes.itemTemplate, itemSlots, item, true) +
					'</div>';
			}).join('');

			var onCanvasEdit = function (key, value) {
				// Which card was edited is read from the DOM at event time.
				var node = document.querySelector('[data-gr-slot="' + key + '"]:focus');
				var holder = node && node.closest('[data-gr-item]');
				var index = holder ? parseInt(holder.getAttribute('data-gr-item'), 10) : activeIndex;
				updateItem(index, key, value);
			};

			var ref = useLiveMarkup(canvasHtml, onCanvasEdit);
			var blockProps = useBlockProps({ className: 'gr-repeatable' });

			var activeItem = items[activeIndex] || {};

			return el(Fragment, {}, [
				el(InspectorControls, { key: 'inspector' }, [
					el(PanelBody, { key: 'cards', title: __('Cards', 'gemreserve-visual-cms'), initialOpen: true }, [
						el('p', { key: 'count', className: 'gr-empty-note' },
							items.length === 1
								? __('1 card in this group.', 'gemreserve-visual-cms')
								: items.length + ' ' + __('cards in this group.', 'gemreserve-visual-cms')),
						el('ol', { key: 'list', className: 'gr-card-list' }, items.map(function (item, index) {
							return el('li', {
								key: index,
								className: 'gr-card-list__row' + (index === activeIndex ? ' is-active' : '')
							}, [
								el(Button, {
									key: 'pick',
									className: 'gr-card-list__name',
									onClick: function () { setActive(index); }
								}, itemTitle(item)),
								el('span', { key: 'ops', className: 'gr-card-list__ops' }, [
									el(Button, {
										key: 'up', icon: 'arrow-up-alt2', label: __('Move up', 'gemreserve-visual-cms'),
										disabled: index === 0, onClick: function () { moveItem(index, -1); }
									}),
									el(Button, {
										key: 'down', icon: 'arrow-down-alt2', label: __('Move down', 'gemreserve-visual-cms'),
										disabled: index === items.length - 1, onClick: function () { moveItem(index, 1); }
									}),
									el(Button, {
										key: 'dup', icon: 'admin-page', label: __('Duplicate', 'gemreserve-visual-cms'),
										onClick: function () { duplicateItem(index); }
									}),
									el(Button, {
										key: 'del', icon: 'trash', isDestructive: true,
										label: __('Remove', 'gemreserve-visual-cms'),
										onClick: function () { removeItem(index); }
									})
								])
							]);
						})),
						el(Button, {
							key: 'add', variant: 'primary', icon: 'plus',
							onClick: addItem
						}, __('Add a card', 'gemreserve-visual-cms'))
					]),
					items.length
						? el(PanelBody, {
							key: 'fields',
							title: __('Images, links and icons on the selected card', 'gemreserve-visual-cms'),
							initialOpen: false
						}, el(SlotFields, {
							slots: itemSlots,
							values: activeItem,
							onChange: function (key, value) { updateItem(activeIndex, key, value); }
						}))
						: null
				]),
				el('div', Object.assign({ key: 'body' }, blockProps), [
					items.length
						? null
						: el(Notice, { key: 'empty', status: 'warning', isDismissible: false },
							__('This group has no cards. It will not appear on the page until you add one.', 'gemreserve-visual-cms')),
					el(parsed.tag, {
						key: 'canvas',
						className: (parsed.props.className || '') + ' gr-repeatable__canvas',
						style: parsed.props.style,
						ref: ref
					})
				])
			]);
		}

	wp.blocks.registerBlockType('gemreserve/repeatable', {
		edit: EditRepeatable,
		save: function () { return null; }
	});

	wp.blocks.registerBlockType('gemreserve/gap', {
		edit: function () { return null; },
		save: function () { return null; }
	});

	function EditPreserved(props) {
			var blockProps = useBlockProps({ className: 'gr-preserved' });
			var canEdit = !!SETTINGS.canUnfilteredHtml;

			return el(Fragment, {}, [
				canEdit
					? el(InspectorControls, { key: 'inspector' },
						el(PanelBody, { title: __('Preserved markup', 'gemreserve-visual-cms'), initialOpen: false },
							el(TextareaControl, {
								label: __('HTML', 'gemreserve-visual-cms'),
								help: __('Administrators only. This is design markup the migration could not turn into fields.', 'gemreserve-visual-cms'),
								value: props.attributes.html || '',
								rows: 12,
								onChange: function (value) { props.setAttributes({ html: value }); },
								__nextHasNoMarginBottom: true
							})
						)
					)
					: null,
				el('div', Object.assign({ key: 'body' }, blockProps), [
					el('span', { key: 'chip', className: 'gr-section__chip' },
						__('Fixed design element', 'gemreserve-visual-cms')),
					el('div', {
						key: 'html',
						className: 'gr-preserved__canvas',
						dangerouslySetInnerHTML: { __html: props.attributes.html || '' }
					})
				])
			]);
		}

	wp.blocks.registerBlockType('gemreserve/preserved', {
		edit: EditPreserved,
		save: function () { return null; }
	});
})(window.wp);
