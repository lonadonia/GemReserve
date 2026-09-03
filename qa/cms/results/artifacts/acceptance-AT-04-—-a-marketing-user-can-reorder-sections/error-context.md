# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: acceptance.spec.ts >> AT-04 — a marketing user can reorder sections
- Location: qa/cms/acceptance.spec.ts:314:5

# Error details

```
TimeoutError: locator.click: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Document Overview/i }).first()

```

# Page snapshot

```yaml
- generic [ref=f2e1]:
  - generic [ref=f2e2]:
    - text:       
    - generic [ref=f2e3]:
      - group [ref=f2e4]:
        - menuitem [ref=f2e5] [cursor=pointer]:
          - generic [ref=f2e7]: About WordPress
      - group [ref=f2e8]:
        - menuitem [ref=f2e9] [cursor=pointer]: GemReserve.io
      - group [ref=f2e10]:
        - menuitem [ref=f2e11] [cursor=pointer]:
          - generic [ref=f2e13]:
            - text: Ctrl+K
            - generic [ref=f2e14]: Open command palette
      - group [ref=f2e15]:
        - menuitem [ref=f2e16] [cursor=pointer]:
          - generic [ref=f2e18]: "0"
          - generic [ref=f2e19]: 0 Comments in moderation
      - group [ref=f2e20]:
        - menuitem [ref=f2e21] [cursor=pointer]:
          - generic [ref=f2e23]: New
      - group [ref=f2e24]:
        - menuitem [ref=f2e25] [cursor=pointer]: View Page
      - group [ref=f2e26]:
        - menuitem [ref=f2e27]: Preview links expire after 15 minutes
      - menu [ref=f2e28]:
        - group [ref=f2e29]:
          - menuitem [ref=f2e30] [cursor=pointer]: Howdy, qa_publisher
    - heading [level=1] [ref=f2e31]: Edit Page
    - generic [ref=f2e33]:
      - generic [ref=f2e34]:
        - region [ref=f2e35]:
          - generic [ref=f2e36]:
            - link [ref=f2e40] [cursor=pointer]:
              - /url: edit.php?post_type=page
            - toolbar [ref=f2e44]:
              - generic [ref=f2e45]:
                - button [ref=f2e46] [cursor=pointer]
                - button [disabled] [ref=f2e49]
                - button [disabled] [ref=f2e52]
                - button [ref=f2e55] [cursor=pointer]
            - button [ref=f2e60] [cursor=pointer]:
              - heading [level=1] [ref=f2e62]:
                - generic [ref=f2e63]: Investor Presentation
                - generic [ref=f2e64]: · Page
            - generic [ref=f2e65]:
              - link [ref=f2e66] [cursor=pointer]:
                - /url: http://127.0.0.1:8899/investors/
              - button [ref=f2e70] [cursor=pointer]
              - button [expanded] [pressed] [ref=f2e74] [cursor=pointer]
              - button [ref=f2e77] [cursor=pointer]: Save
              - button [ref=f2e79] [cursor=pointer]
        - generic [ref=f2e82]:
          - region [ref=f2e83]:
            - iframe [ref=f2e89]:
              - generic [ref=f3e1]:
                - textbox "Add title" [ref=f3e3]
                - generic [ref=f3e4]:
                  - 'document "Block: Page section" [ref=f3e5]':
                    - generic: EXECUTIVE OVERVIEW
                    - generic [ref=f3e6]:
                      - 'document "Block: Content" [ref=f3e7]':
                        - heading [level=2] [ref=f3e12]:
                          - text: ◆
                          - textbox "Heading" [ref=f3e13]
                          - text: ◆
                      - 'document "Block: Layout group" [ref=f3e15]':
                        - generic [ref=f3e16]:
                          - 'document "Block: Content" [ref=f3e17]':
                            - paragraph [ref=f3e19]:
                              - textbox "Paragraph" [ref=f3e20]
                          - 'document "Block: Layout group" [ref=f3e21]':
                            - list [ref=f3e22]:
                              - 'document "Block: Content" [ref=f3e23]':
                                - listitem [ref=f3e25]:
                                  - img "A gold globe on a ring stand"
                                  - heading [level=3] [ref=f3e26]:
                                    - textbox "Subheading" [ref=f3e27]
                                  - paragraph [ref=f3e28]:
                                    - textbox "Paragraph" [ref=f3e29]
                              - 'document "Block: Content" [ref=f3e30]':
                                - listitem [ref=f3e32]:
                                  - img "A gold arrow rising over ascending columns"
                                  - heading [level=3] [ref=f3e33]:
                                    - textbox "Subheading" [ref=f3e34]
                                  - paragraph [ref=f3e35]:
                                    - textbox "Paragraph" [ref=f3e36]
                              - 'document "Block: Content" [ref=f3e37]':
                                - listitem [ref=f3e39]:
                                  - img "A lattice of gold network nodes"
                                  - heading [level=3] [ref=f3e40]:
                                    - textbox "Subheading" [ref=f3e41]
                                  - paragraph [ref=f3e42]:
                                    - textbox "Paragraph" [ref=f3e43]
                              - 'document "Block: Content" [ref=f3e44]':
                                - listitem [ref=f3e46]:
                                  - img "A gold hourglass in an ornate frame"
                                  - heading [level=3] [ref=f3e47]:
                                    - textbox "Subheading" [ref=f3e48]
                                  - paragraph [ref=f3e49]:
                                    - textbox "Paragraph" [ref=f3e50]
                  - 'document "Block: Page section" [ref=f3e51]':
                    - generic: THE MARKET OPPORTUNITY
                    - generic [ref=f3e52]:
                      - 'document "Block: Layout group" [ref=f3e53]':
                        - generic [ref=f3e54]:
                          - 'document "Block: Content" [ref=f3e55]':
                            - heading [level=2] [ref=f3e57]:
                              - textbox "Heading" [ref=f3e58]
                          - 'document "Block: Content" [ref=f3e59]':
                            - paragraph [ref=f3e61]:
                              - textbox "Paragraph" [ref=f3e62]
                          - 'document "Block: Layout group" [ref=f3e63]':
                            - generic [ref=f3e64]:
                              - 'document "Block: Layout group"':
                                - figure:
                                  - 'document "Block: Content"'
                                  - 'document "Block: Content"':
                                    - generic:
                                      - generic:
                                        - textbox "Label" [ref=f3e66]
                                        - textbox "Label" [ref=f3e68]
                              - 'document "Block: Card list" [ref=f3e69]':
                                - list [ref=f3e70]:
                                  - listitem [ref=f3e72]:
                                    - generic [ref=f3e73]:
                                      - heading [level=3] [ref=f3e74]:
                                        - textbox "Subheading" [ref=f3e75]
                                      - paragraph [ref=f3e76]:
                                        - textbox "Paragraph" [ref=f3e77]
                                  - listitem [ref=f3e79]:
                                    - generic [ref=f3e80]:
                                      - heading [level=3] [ref=f3e81]:
                                        - textbox "Subheading" [ref=f3e82]
                                      - paragraph [ref=f3e83]:
                                        - textbox "Paragraph" [ref=f3e84]
                                  - listitem [ref=f3e86]:
                                    - generic [ref=f3e87]:
                                      - heading [level=3] [ref=f3e88]:
                                        - textbox "Subheading" [ref=f3e89]
                                      - paragraph [ref=f3e90]:
                                        - textbox "Paragraph" [ref=f3e91]
                                  - listitem [ref=f3e93]:
                                    - generic [ref=f3e94]:
                                      - heading [level=3] [ref=f3e95]:
                                        - textbox "Subheading" [ref=f3e96]
                                      - paragraph [ref=f3e97]:
                                        - textbox "Paragraph" [ref=f3e98]
                      - 'document "Block: Layout group" [ref=f3e99]':
                        - generic [ref=f3e100]:
                          - 'document "Block: Content" [ref=f3e101]':
                            - heading [level=2] [ref=f3e103]:
                              - textbox "Heading" [ref=f3e104]
                          - 'document "Block: Content" [ref=f3e105]':
                            - paragraph [ref=f3e107]:
                              - textbox "Paragraph" [ref=f3e108]
                          - 'document "Block: Card list" [ref=f3e109]':
                            - list [ref=f3e110]:
                              - listitem [ref=f3e112]:
                                - generic [ref=f3e113]:
                                  - heading [level=3] [ref=f3e114]:
                                    - textbox "Subheading" [ref=f3e115]
                                  - paragraph [ref=f3e116]:
                                    - textbox "Paragraph" [ref=f3e117]
                              - listitem [ref=f3e119]:
                                - generic [ref=f3e120]:
                                  - heading [level=3] [ref=f3e121]:
                                    - textbox "Subheading" [ref=f3e122]
                                  - paragraph [ref=f3e123]:
                                    - textbox "Paragraph" [ref=f3e124]
                              - listitem [ref=f3e126]:
                                - generic [ref=f3e127]:
                                  - heading [level=3] [ref=f3e128]:
                                    - textbox "Subheading" [ref=f3e129]
                                  - paragraph [ref=f3e130]:
                                    - textbox "Paragraph" [ref=f3e131]
                              - listitem [ref=f3e133]:
                                - generic [ref=f3e134]:
                                  - heading [level=3] [ref=f3e135]:
                                    - textbox "Subheading" [ref=f3e136]
                                  - paragraph [ref=f3e137]:
                                    - textbox "Paragraph" [ref=f3e138]
                      - 'document "Block: Layout group" [ref=f3e139]':
                        - generic [ref=f3e140]:
                          - 'document "Block: Content" [ref=f3e141]':
                            - heading [level=2] [ref=f3e143]:
                              - textbox "Heading" [ref=f3e144]
                          - 'document "Block: Card list" [ref=f3e145]':
                            - list [ref=f3e146]:
                              - listitem [ref=f3e148]:
                                - generic [ref=f3e149]:
                                  - heading [level=3] [ref=f3e150]:
                                    - textbox "Subheading" [ref=f3e151]
                                  - paragraph [ref=f3e152]:
                                    - textbox "Paragraph" [ref=f3e153]
                              - listitem [ref=f3e155]:
                                - generic [ref=f3e156]:
                                  - heading [level=3] [ref=f3e157]:
                                    - textbox "Subheading" [ref=f3e158]
                                  - paragraph [ref=f3e159]:
                                    - textbox "Paragraph" [ref=f3e160]
                              - listitem [ref=f3e162]:
                                - generic [ref=f3e163]:
                                  - heading [level=3] [ref=f3e164]:
                                    - textbox "Subheading" [ref=f3e165]
                                  - paragraph [ref=f3e166]:
                                    - textbox "Paragraph" [ref=f3e167]
                              - listitem [ref=f3e169]:
                                - generic [ref=f3e170]:
                                  - heading [level=3] [ref=f3e171]:
                                    - textbox "Subheading" [ref=f3e172]
                                  - paragraph [ref=f3e173]:
                                    - textbox "Paragraph" [ref=f3e174]
                              - listitem [ref=f3e176]:
                                - generic [ref=f3e177]:
                                  - heading [level=3] [ref=f3e178]:
                                    - textbox "Subheading" [ref=f3e179]
                                  - paragraph [ref=f3e180]:
                                    - textbox "Paragraph" [ref=f3e181]
                  - 'document "Block: Page section" [ref=f3e182]':
                    - generic: FINANCIAL HIGHLIGHTS (PROJECTED)
                    - generic [ref=f3e183]:
                      - 'document "Block: Layout group" [ref=f3e184]':
                        - generic [ref=f3e185]:
                          - 'document "Block: Content" [ref=f3e186]':
                            - heading [level=2] [ref=f3e188]:
                              - textbox "Heading" [ref=f3e189]
                          - 'document "Block: Content" [ref=f3e190]':
                            - generic [ref=f3e192]:
                              - generic [ref=f3e193]:
                                - term [ref=f3e194]:
                                  - textbox "Text" [ref=f3e195]
                                - definition [ref=f3e196]:
                                  - textbox "Text" [ref=f3e197]
                              - generic [ref=f3e198]:
                                - term [ref=f3e199]:
                                  - textbox "Text" [ref=f3e200]
                                - definition [ref=f3e201]:
                                  - textbox "Text" [ref=f3e202]
                              - generic [ref=f3e203]:
                                - term [ref=f3e204]:
                                  - textbox "Text" [ref=f3e205]
                                - definition [ref=f3e206]:
                                  - textbox "Text" [ref=f3e207]
                                  - textbox "Text" [ref=f3e209]
                              - generic [ref=f3e210]:
                                - term [ref=f3e211]:
                                  - textbox "Text" [ref=f3e212]
                                - definition [ref=f3e213]:
                                  - textbox "Text" [ref=f3e214]
                              - generic [ref=f3e215]:
                                - term [ref=f3e216]:
                                  - textbox "Text" [ref=f3e217]
                                - definition [ref=f3e218]:
                                  - textbox "Text" [ref=f3e219]
                                  - textbox "Text" [ref=f3e221]
                      - 'document "Block: Layout group" [ref=f3e222]':
                        - generic [ref=f3e223]:
                          - 'document "Block: Content" [ref=f3e224]':
                            - heading [level=2] [ref=f3e226]:
                              - textbox "Heading" [ref=f3e227]
                          - 'document "Block: Layout group" [ref=f3e228]':
                            - figure [ref=f3e229]:
                              - 'document "Block: Content"'
                              - 'document "Block: Content" [ref=f3e230]':
                                - list [ref=f3e233]:
                                  - listitem [ref=f3e234]:
                                    - textbox "Label" [ref=f3e237]
                                    - generic [ref=f3e238]:
                                      - textbox "Label" [ref=f3e239]
                                      - textbox "Label" [ref=f3e240]
                                  - listitem [ref=f3e241]:
                                    - textbox "Label" [ref=f3e244]
                                    - generic [ref=f3e245]:
                                      - textbox "Label" [ref=f3e246]
                                      - textbox "Label" [ref=f3e247]
                                  - listitem [ref=f3e248]:
                                    - textbox "Label" [ref=f3e251]
                                    - generic [ref=f3e252]:
                                      - textbox "Label" [ref=f3e253]
                                      - textbox "Label" [ref=f3e254]
                                  - listitem [ref=f3e255]:
                                    - textbox "Label" [ref=f3e258]
                                    - generic [ref=f3e259]:
                                      - textbox "Label" [ref=f3e260]
                                      - textbox "Label" [ref=f3e261]
                                  - listitem [ref=f3e262]:
                                    - textbox "Label" [ref=f3e265]
                                    - generic [ref=f3e266]:
                                      - textbox "Label" [ref=f3e267]
                                      - textbox "Label" [ref=f3e268]
                  - 'document "Block: Page section" [ref=f3e269]':
                    - generic: OUR ROADMAP
                    - generic [ref=f3e270]:
                      - 'document "Block: Layout group" [ref=f3e271]':
                        - generic [ref=f3e272]:
                          - 'document "Block: Content" [ref=f3e273]':
                            - heading [level=2] [ref=f3e275]:
                              - textbox "Heading" [ref=f3e276]
                          - 'document "Block: Card list" [ref=f3e277]':
                            - list [ref=f3e278]:
                              - listitem [ref=f3e280]:
                                - paragraph [ref=f3e282]:
                                  - textbox "Paragraph" [ref=f3e283]
                                - heading [level=3] [ref=f3e284]:
                                  - textbox "Subheading" [ref=f3e285]
                                - paragraph [ref=f3e286]:
                                  - textbox "Paragraph" [ref=f3e287]
                              - listitem [ref=f3e289]:
                                - paragraph [ref=f3e291]:
                                  - textbox "Paragraph" [ref=f3e292]
                                - heading [level=3] [ref=f3e293]:
                                  - textbox "Subheading" [ref=f3e294]
                                - paragraph [ref=f3e295]:
                                  - textbox "Paragraph" [ref=f3e296]
                              - listitem [ref=f3e298]:
                                - paragraph [ref=f3e300]:
                                  - textbox "Paragraph" [ref=f3e301]
                                - heading [level=3] [ref=f3e302]:
                                  - textbox "Subheading" [ref=f3e303]
                                - paragraph [ref=f3e304]:
                                  - textbox "Paragraph" [ref=f3e305]
                              - listitem [ref=f3e307]:
                                - paragraph [ref=f3e309]:
                                  - textbox "Paragraph" [ref=f3e310]
                                - heading [level=3] [ref=f3e311]:
                                  - textbox "Subheading" [ref=f3e312]
                                - paragraph [ref=f3e313]:
                                  - textbox "Paragraph" [ref=f3e314]
                              - listitem [ref=f3e316]:
                                - paragraph [ref=f3e318]:
                                  - textbox "Paragraph" [ref=f3e319]
                                - heading [level=3] [ref=f3e320]:
                                  - textbox "Subheading" [ref=f3e321]
                                - paragraph [ref=f3e322]:
                                  - textbox "Paragraph" [ref=f3e323]
                      - 'document "Block: Layout group" [ref=f3e324]':
                        - generic [ref=f3e325]:
                          - 'document "Block: Content" [ref=f3e326]':
                            - heading [level=2] [ref=f3e328]:
                              - textbox "Heading" [ref=f3e329]
                          - 'document "Block: Content" [ref=f3e330]':
                            - paragraph [ref=f3e332]:
                              - textbox "Paragraph" [ref=f3e333]
                          - 'document "Block: Content" [ref=f3e334]':
                            - paragraph [ref=f3e336]:
                              - textbox "Paragraph" [ref=f3e337]
                          - 'document "Block: Content" [ref=f3e338]':
                            - link [ref=f3e340] [cursor=pointer]:
                              - /url: /#waitlist
                              - textbox "Label" [ref=f3e342]
                              - textbox "Label" [ref=f3e344]
                          - 'document "Block: Content" [ref=f3e345]':
                            - paragraph [ref=f3e347]:
                              - textbox "Paragraph" [ref=f3e348]
                  - 'document "Block: Page section" [ref=f3e349]':
                    - generic: Investor assurances
                    - 'document "Block: Layout group" [ref=f3e351]':
                      - 'document "Block: Card list" [ref=f3e353]':
                        - list [ref=f3e354]:
                          - listitem [ref=f3e356]:
                            - generic [ref=f3e357]:
                              - heading [level=2] [ref=f3e358]:
                                - textbox "Heading" [ref=f3e359]
                              - paragraph [ref=f3e360]:
                                - textbox "Paragraph" [ref=f3e361]
                          - listitem [ref=f3e363]:
                            - generic [ref=f3e364]:
                              - heading [level=2] [ref=f3e365]:
                                - textbox "Heading" [ref=f3e366]
                              - paragraph [ref=f3e367]:
                                - textbox "Paragraph" [ref=f3e368]
                          - listitem [ref=f3e370]:
                            - generic [ref=f3e371]:
                              - heading [level=2] [ref=f3e372]:
                                - textbox "Heading" [ref=f3e373]
                              - paragraph [ref=f3e374]:
                                - textbox "Paragraph" [ref=f3e375]
                          - listitem [ref=f3e377]:
                            - generic [ref=f3e378]:
                              - heading [level=2] [ref=f3e379]:
                                - textbox "Heading" [ref=f3e380]
                              - paragraph [ref=f3e381]:
                                - textbox "Paragraph" [ref=f3e382]
            - region [ref=f2e90]:
              - generic [ref=f2e91]:
                - button [ref=f2e92] [cursor=pointer]: Meta Boxes
                - separator [ref=f2e95]
                - generic [ref=f2e96]: Use up and down arrow keys to resize the meta box pane.
          - region [ref=f2e97]:
            - generic [ref=f2e99]:
              - generic [ref=f2e100]:
                - tablist [ref=f2e101]:
                  - tab [selected] [ref=f2e102] [cursor=pointer]:
                    - generic [ref=f2e103]: Page
                  - tab [ref=f2e104] [cursor=pointer]:
                    - generic [ref=f2e105]: Block
                - button [ref=f2e106] [cursor=pointer]
              - tabpanel [ref=f2e110]:
                - generic [ref=f2e112]:
                  - generic [ref=f2e114]:
                    - heading [level=2] [ref=f2e118]:
                      - generic [ref=f2e119]: Investor Presentation
                    - button [ref=f2e120] [cursor=pointer]
                  - button [ref=f2e125] [cursor=pointer]: Set featured image
                  - generic [ref=f2e126]: Last edited 33 minutes ago.
                  - generic [ref=f2e128]:
                    - generic [ref=f2e129]:
                      - generic [ref=f2e130]:
                        - generic [ref=f2e131]: Status
                        - button [ref=f2e134] [cursor=pointer]: Published
                      - generic [ref=f2e137]:
                        - generic [ref=f2e138]: Publish
                        - button [ref=f2e141] [cursor=pointer]: August 29 5:56 pm
                      - generic [ref=f2e142]:
                        - generic [ref=f2e143]: Slug
                        - button [ref=f2e146] [cursor=pointer]: investors
                      - generic [ref=f2e147]:
                        - generic [ref=f2e148]: Author
                        - button [ref=f2e151] [cursor=pointer]: (No author)
                      - generic [ref=f2e152]:
                        - generic [ref=f2e153]: Discussion
                        - button [ref=f2e156] [cursor=pointer]: Closed
                      - generic [ref=f2e157]:
                        - generic [ref=f2e158]: Revisions
                        - link [ref=f2e160] [cursor=pointer]:
                          - /url: revision.php?revision=394
                          - text: "3"
                      - generic [ref=f2e161]:
                        - generic [ref=f2e162]: Parent
                        - button [ref=f2e165] [cursor=pointer]: None
                    - button [ref=f2e166] [cursor=pointer]: Move to trash
          - button [disabled] [ref=f2e168]: Open save panel
      - region [ref=f2e169]:
        - list [ref=f2e170]:
          - listitem [ref=f2e171]:
            - generic [ref=f2e172]: Page
  - dialog "Welcome to the editor" [active] [ref=f2e176]:
    - document [ref=f2e177]:
      - button "Close" [ref=f2e179] [cursor=pointer]
      - generic [ref=f2e183]:
        - generic [ref=f2e184]:
          - list "Guide controls" [ref=f2e186]:
            - listitem [ref=f2e187]:
              - button "Page 1 of 4" [ref=f2e188] [cursor=pointer]
            - listitem [ref=f2e191]:
              - button "Page 2 of 4" [ref=f2e192] [cursor=pointer]
            - listitem [ref=f2e195]:
              - button "Page 3 of 4" [ref=f2e196] [cursor=pointer]
            - listitem [ref=f2e199]:
              - button "Page 4 of 4" [ref=f2e200] [cursor=pointer]
          - heading "Welcome to the editor" [level=1] [ref=f2e203]
          - paragraph [ref=f2e204]: In the WordPress editor, each paragraph, image, or video is presented as a distinct “block” of content.
        - button "Next" [ref=f2e206] [cursor=pointer]
```

# Test source

```ts
  1   | /**
  2   |  * The eleven client acceptance requirements.
  3   |  *
  4   |  * Each test corresponds to one numbered requirement from §23 of the brief, and
  5   |  * each is written the way the requirement is written: as something a
  6   |  * non-technical marketing user does, through the interface they will actually
  7   |  * use, with the result checked on the public page rather than in the database.
  8   |  *
  9   |  * Three rules held throughout:
  10  |  *
  11  |  * The assertion is always on the *public output*. "The editor accepted my
  12  |  * change" is not evidence that a visitor sees it — the whole class of bug this
  13  |  * project exists to fix lived in the gap between those two statements.
  14  |  *
  15  |  * Blocks are selected through the List View rather than by clicking the canvas.
  16  |  * That is both more robust — a click on a section can land on a text slot
  17  |  * inside it and select the wrong thing — and more honest: the List View is the
  18  |  * panel a marketing user opens to see the sections of their page, so testing
  19  |  * through it tests the path they will take.
  20  |  *
  21  |  * Every test cleans up after itself. They run against a live instance, in
  22  |  * order, sharing content; a test that leaves a page renamed makes the next
  23  |  * run's failure someone else's puzzle.
  24  |  */
  25  | 
  26  | import { expect, test, type Page } from "@playwright/test";
  27  | 
  28  | import {
  29  |   assertSafeTarget,
  30  |   canvas,
  31  |   login,
  32  |   marker,
  33  |   openEditor,
  34  |   pageIdBySlug,
  35  |   publicHtml,
  36  |   save,
  37  | } from "./helpers";
  38  | 
  39  | test.beforeAll(() => {
  40  |   assertSafeTarget(process.env.CMS_BASE_URL);
  41  | });
  42  | 
  43  | /* ------------------------------------------------------------------ */
  44  | /* Editor interactions                                                 */
  45  | /* ------------------------------------------------------------------ */
  46  | 
  47  | /**
  48  |  * Open the List View — the panel showing the page's sections.
  49  |  *
  50  |  * This is the panel a marketing user opens to see their page as a list of
  51  |  * sections, so it is both the robust way to select a block and the honest one.
  52  |  */
  53  | async function openListView(page: Page): Promise<void> {
  54  |   const rows = page.getByRole("row");
  55  | 
  56  |   if (!(await rows.first().isVisible({ timeout: 2_000 }).catch(() => false))) {
> 57  |     await page.getByRole("button", { name: /Document Overview/i }).first().click();
      |                                                                            ^ TimeoutError: locator.click: Timeout 20000ms exceeded.
  58  |   }
  59  |   await expect(rows.first(), "the List View must open").toBeVisible({ timeout: 20_000 });
  60  | }
  61  | 
  62  | /**
  63  |  * The List View rows for top-level sections.
  64  |  *
  65  |  * Filtered by name because the list also carries a "Spacing" row for each
  66  |  * `gemreserve/gap` — the whitespace blocks that let the migration reproduce the
  67  |  * original formatting exactly. They are inert and uneditable; see
  68  |  * CMS_ACCEPTANCE_TESTS.md for the note on their visibility.
  69  |  */
  70  | function sectionRows(page: Page) {
  71  |   return page.getByRole("row").filter({ hasText: "Page section" });
  72  | }
  73  | 
  74  | /** Select the nth section through the List View. */
  75  | async function selectSection(page: Page, index: number): Promise<void> {
  76  |   await openListView(page);
  77  |   await sectionRows(page).nth(index).locator("a").first().click();
  78  | }
  79  | 
  80  | /**
  81  |  * Edit a text slot in the canvas.
  82  |  *
  83  |  * `fill` on a contenteditable dispatches the input event the block listens for,
  84  |  * and clicking the body afterwards moves focus out so the change is committed
  85  |  * to the block's attributes before a save.
  86  |  */
  87  | async function editSlot(page: Page, index: number, value: string): Promise<string> {
  88  |   const slot = canvas(page).locator(".gr-slot").nth(index);
  89  |   await expect(slot).toBeVisible({ timeout: 30_000 });
  90  |   const before = ((await slot.textContent()) ?? "").trim();
  91  |   await slot.click();
  92  |   await slot.fill(value);
  93  |   await canvas(page).locator("body").click({ position: { x: 4, y: 4 } });
  94  | 
  95  |   return before;
  96  | }
  97  | 
  98  | /**
  99  |  * Select content blocks in turn until one offers the Media Library picker.
  100 |  *
  101 |  * Returns that picker. Fails the test if no block on the page offers one.
  102 |  */
  103 | async function selectBlockOfferingMedia(page: Page) {
  104 |   // The List View in this Gutenberg shows only top-level blocks — sections and
  105 |   // spacing — with no expander, so a content block nested inside a section
  106 |   // cannot be reached through it. Clicking the image itself does not work
  107 |   // either: the migrated markup uses Next.js `fill` images, absolutely
  108 |   // positioned inside a container that has no height in the editor canvas, so
  109 |   // the <img> is permanently `hidden` to a pointer.
  110 |   //
  111 |   // So the block is selected through the editor's own store, which is exactly
  112 |   // what a click dispatches. What is being tested is whether the control
  113 |   // exists and works once the block is selected, not Playwright's ability to
  114 |   // hit a zero-height element.
  115 |   const selected = await page.evaluate(() => {
  116 |     const editor = (window as unknown as {
  117 |       wp?: { data?: { select: (s: string) => unknown; dispatch: (s: string) => unknown } };
  118 |     }).wp?.data;
  119 |     if (!editor) {
  120 |       return false;
  121 |     }
  122 |     const store = editor.select("core/block-editor") as {
  123 |       getClientIdsWithDescendants?: () => string[];
  124 |       getBlock?: (id: string) => { name?: string; attributes?: Record<string, unknown> } | null;
  125 |     };
  126 |     const actions = editor.dispatch("core/block-editor") as {
  127 |       selectBlock?: (id: string) => void;
  128 |     };
  129 | 
  130 |     for (const clientId of store.getClientIdsWithDescendants?.() ?? []) {
  131 |       const block = store.getBlock?.(clientId);
  132 |       if (block?.name !== "gemreserve/content") {
  133 |         continue;
  134 |       }
  135 |       const template = String(block.attributes?.template ?? "");
  136 |       if (template.includes("<img")) {
  137 |         actions.selectBlock?.(clientId);
  138 |         return true;
  139 |       }
  140 |     }
  141 |     return false;
  142 |   });
  143 | 
  144 |   expect(selected, "the page must contain a content block with an image").toBe(true);
  145 | 
  146 |   return page
  147 |     .locator(".block-editor-block-inspector")
  148 |     .getByRole("button", { name: /Choose from Media Library/i })
  149 |     .first();
  150 | }
  151 | 
  152 | /**
  153 |  * Delete a section through its own row menu in the List View.
  154 |  *
  155 |  * Each List View row carries an Options button. Using it avoids depending on
  156 |  * the canvas block toolbar being rendered and focused, which is what a click in
  157 |  * the canvas gets you and is not reliable when the block is off-screen.
```