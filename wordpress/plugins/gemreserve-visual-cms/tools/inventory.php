<?php
define('ABSPATH','/tmp/');
function esc_html($s){return htmlspecialchars((string)$s,ENT_QUOTES|ENT_SUBSTITUTE|ENT_HTML5,'UTF-8');}
function esc_attr($s){return esc_html($s);} function esc_url($s,$p=null){return esc_html($s);}
function wp_kses($s,$a){return $s;}
$B='/var/www/GemReserve/GemReserve/wordpress/plugins/gemreserve-visual-cms/includes/';
foreach(['class-html','class-slot-template','class-decomposer','class-renderer'] as $f) require $B."$f.php";
use GemReserve\VisualCms\{Decomposer,Renderer};
function render_tree(array $bs): string { $o='';
  foreach($bs as $b){ $i=$b['inner']?render_tree($b['inner']):'';
    $o.=match($b['name']){'gemreserve/section'=>Renderer::section($b['attrs'],$i),'gemreserve/wrapper'=>Renderer::wrapper($b['attrs'],$i),
    'gemreserve/content'=>Renderer::content($b['attrs']),'gemreserve/repeatable'=>Renderer::repeatable($b['attrs']),
    'gemreserve/gap'=>Renderer::gap($b['attrs']),'gemreserve/preserved'=>Renderer::preserved($b['attrs']),default=>''};}
  return $o; }
function tally($bs,&$a){ foreach($bs as $b){$a[$b['name']]=($a[$b['name']]??0)+1; if($b['inner'])tally($b['inner'],$a);} }
function sections($bs){ $o=[]; foreach($bs as $b) if($b['name']==='gemreserve/section') $o[]=$b; return $o; }
$rows=[];
foreach(glob($argv[1].'/*.html') as $f){
  $base=basename($f,'.html'); [$id,$slug]=explode('-',$base,2);
  $h=file_get_contents($f); $d=new Decomposer(); $t=$d->decompose_body($h); $s=$d->stats();
  $a=[]; tally($t,$a);
  $secs=array_map(fn($b)=>['label'=>$b['attrs']['label'],'variant'=>$b['attrs']['variant']],sections($t));
  $rows[]=['id'=>(int)$id,'slug'=>$slug,'body_bytes'=>strlen($h),'identical'=>render_tree($t)===$h,
    'sections'=>count($secs),'blocks'=>array_sum($a),'slots'=>$s['slots'],'repeatables'=>$s['repeatables'],
    'preserved'=>$s['preserved'],'block_mix'=>$a,'section_list'=>$secs];
}
usort($rows,fn($x,$y)=>strcmp($x['slug'],$y['slug']));
file_put_contents($argv[2], json_encode($rows, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));
$tot=array_reduce($rows,fn($c,$r)=>['sections'=>$c['sections']+$r['sections'],'blocks'=>$c['blocks']+$r['blocks'],
 'slots'=>$c['slots']+$r['slots'],'rep'=>$c['rep']+$r['repeatables'],'pres'=>$c['pres']+$r['preserved'],
 'ok'=>$c['ok']+($r['identical']?1:0)],['sections'=>0,'blocks'=>0,'slots'=>0,'rep'=>0,'pres'=>0,'ok'=>0]);
printf("pages=%d identical=%d sections=%d blocks=%d slots=%d repeatables=%d preserved=%d\n",
 count($rows),$tot['ok'],$tot['sections'],$tot['blocks'],$tot['slots'],$tot['rep'],$tot['pres']);
