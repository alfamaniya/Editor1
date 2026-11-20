(() => {
  "use strict";
  const preview=document.getElementById("preview-frame"); if(!preview)return;
  const specs={
    color:[["Background","background-color","color","backgroundColor"],["Text color","color","color","color"],["Border color","border-color","color","borderColor"],["Opacity","opacity","range","opacity"],["Caret color","caret-color","text","caretColor"],["Accent color","accent-color","text","accentColor"],["Color scheme","color-scheme","select","colorScheme"]],
    background:[["Background shorthand","background","text","background"],["Color","background-color","text","backgroundColor"],["Image / layers","background-image","text","backgroundImage"],["Position","background-position","text","backgroundPosition"],["Position X","background-position-x","text","backgroundPositionX"],["Position Y","background-position-y","text","backgroundPositionY"],["Size","background-size","text","backgroundSize"],["Repeat","background-repeat","select","backgroundRepeat"],["Attachment","background-attachment","select","backgroundAttachment"],["Origin","background-origin","select","backgroundOrigin"],["Clip","background-clip","select","backgroundClip"],["Blend mode","background-blend-mode","select","backgroundBlendMode"]],
    border:[["Border shorthand","border","text","border"],["Style","border-style","select","borderStyle"],["Width","border-width","text","borderWidth"],["Color","border-color","text","borderColor"],["Top","border-top","text","borderTop"],["Right","border-right","text","borderRight"],["Bottom","border-bottom","text","borderBottom"],["Left","border-left","text","borderLeft"],["Top style","border-top-style","select","borderTopStyle"],["Right style","border-right-style","select","borderRightStyle"],["Bottom style","border-bottom-style","select","borderBottomStyle"],["Left style","border-left-style","select","borderLeftStyle"],["Top width","border-top-width","text","borderTopWidth"],["Right width","border-right-width","text","borderRightWidth"],["Bottom width","border-bottom-width","text","borderBottomWidth"],["Left width","border-left-width","text","borderLeftWidth"],["Top color","border-top-color","text","borderTopColor"],["Right color","border-right-color","text","borderRightColor"],["Bottom color","border-bottom-color","text","borderBottomColor"],["Left color","border-left-color","text","borderLeftColor"],["Radius","border-radius","text","borderRadius"],["Top-left radius","border-top-left-radius","text","borderTopLeftRadius"],["Top-right radius","border-top-right-radius","text","borderTopRightRadius"],["Bottom-right radius","border-bottom-right-radius","text","borderBottomRightRadius"],["Bottom-left radius","border-bottom-left-radius","text","borderBottomLeftRadius"],["Border image source","border-image-source","text","borderImageSource"],["Border image slice","border-image-slice","text","borderImageSlice"],["Border image width","border-image-width","text","borderImageWidth"],["Border image outset","border-image-outset","text","borderImageOutset"],["Border image repeat","border-image-repeat","select","borderImageRepeat"]],
    outline:[["Outline shorthand","outline","text","outline"],["Style","outline-style","select","outlineStyle"],["Width","outline-width","text","outlineWidth"],["Color","outline-color","text","outlineColor"],["Offset","outline-offset","text","outlineOffset"]],
    size:[["Width","width","text","width"],["Height","height","text","height"],["Min width","min-width","text","minWidth"],["Max width","max-width","text","maxWidth"],["Min height","min-height","text","minHeight"],["Max height","max-height","text","maxHeight"],["Inline size","inline-size","text","inlineSize"],["Block size","block-size","text","blockSize"],["Min inline size","min-inline-size","text","minInlineSize"],["Max inline size","max-inline-size","text","maxInlineSize"],["Min block size","min-block-size","text","minBlockSize"],["Max block size","max-block-size","text","maxBlockSize"],["Aspect ratio","aspect-ratio","text","aspectRatio"],["Box sizing","box-sizing","select","boxSizing"],["Overflow","overflow","select","overflow"],["Overflow X","overflow-x","select","overflowX"],["Overflow Y","overflow-y","select","overflowY"],["Object fit","object-fit","select","objectFit"],["Object position","object-position","text","objectPosition"],["Contain","contain","text","contain"]],
    shadow:[["Box shadow","box-shadow","text","boxShadow"],["Text shadow","text-shadow","text","textShadow"]],
    spacing:[["Margin","margin","text","margin"],["Margin top","margin-top","text","marginTop"],["Margin right","margin-right","text","marginRight"],["Margin bottom","margin-bottom","text","marginBottom"],["Margin left","margin-left","text","marginLeft"],["Margin inline","margin-inline","text","marginInline"],["Margin block","margin-block","text","marginBlock"],["Padding","padding","text","padding"],["Padding top","padding-top","text","paddingTop"],["Padding right","padding-right","text","paddingRight"],["Padding bottom","padding-bottom","text","paddingBottom"],["Padding left","padding-left","text","paddingLeft"],["Padding inline","padding-inline","text","paddingInline"],["Padding block","padding-block","text","paddingBlock"],["Row gap","row-gap","text","rowGap"],["Column gap","column-gap","text","columnGap"],["Gap shorthand","gap","text","gap"]],
    typography:[["Font shorthand","font","text","font"],["Font family","font-family","text","fontFamily"],["Font size","font-size","text","fontSize"],["Font weight","font-weight","text","fontWeight"],["Font style","font-style","select","fontStyle"],["Font stretch","font-stretch","text","fontStretch"],["Font variant","font-variant","text","fontVariant"],["Line height","line-height","text","lineHeight"],["Letter spacing","letter-spacing","text","letterSpacing"],["Word spacing","word-spacing","text","wordSpacing"],["Text align","text-align","select","textAlign"],["Text align last","text-align-last","select","textAlignLast"],["Text transform","text-transform","select","textTransform"],["Text decoration","text-decoration","text","textDecoration"],["Decoration line","text-decoration-line","text","textDecorationLine"],["Decoration color","text-decoration-color","text","textDecorationColor"],["Decoration style","text-decoration-style","select","textDecorationStyle"],["Decoration thickness","text-decoration-thickness","text","textDecorationThickness"],["Underline offset","text-underline-offset","text","textUnderlineOffset"],["Indent","text-indent","text","textIndent"],["White space","white-space","select","whiteSpace"],["Text overflow","text-overflow","select","textOverflow"],["Word break","word-break","select","wordBreak"],["Overflow wrap","overflow-wrap","select","overflowWrap"],["Hyphens","hyphens","select","hyphens"],["Writing mode","writing-mode","select","writingMode"],["Text orientation","text-orientation","select","textOrientation"],["Vertical align","vertical-align","text","verticalAlign"],["Direction","direction","select","direction"]],
    layout:[["Display","display","select","display"],["Box sizing","box-sizing","select","boxSizing"],["Visibility","visibility","select","visibility"],["Vertical align","vertical-align","text","verticalAlign"],["Float","float","select","float"],["Clear","clear","select","clear"],["Columns","columns","text","columns"],["Column count","column-count","text","columnCount"],["Column width","column-width","text","columnWidth"],["Column gap","column-gap","text","columnGap"],["Column rule","column-rule","text","columnRule"],["Column span","column-span","select","columnSpan"],["Column fill","column-fill","select","columnFill"],["Break before","break-before","select","breakBefore"],["Break after","break-after","select","breakAfter"],["Break inside","break-inside","select","breakInside"]],
    flex:[["Direction","flex-direction","select","flexDirection"],["Wrap","flex-wrap","select","flexWrap"],["Flow","flex-flow","text","flexFlow"],["Justify content","justify-content","select","justifyContent"],["Align items","align-items","select","alignItems"],["Align content","align-content","select","alignContent"],["Gap","gap","text","gap"],["Row gap","row-gap","text","rowGap"],["Column gap","column-gap","text","columnGap"],["Flex","flex","text","flex"],["Grow","flex-grow","text","flexGrow"],["Shrink","flex-shrink","text","flexShrink"],["Basis","flex-basis","text","flexBasis"],["Align self","align-self","select","alignSelf"],["Order","order","text","order"]],
    grid:[["Template","grid-template","text","gridTemplate"],["Template columns","grid-template-columns","text","gridTemplateColumns"],["Template rows","grid-template-rows","text","gridTemplateRows"],["Template areas","grid-template-areas","text","gridTemplateAreas"],["Auto columns","grid-auto-columns","text","gridAutoColumns"],["Auto rows","grid-auto-rows","text","gridAutoRows"],["Auto flow","grid-auto-flow","select","gridAutoFlow"],["Column gap","column-gap","text","columnGap"],["Row gap","row-gap","text","rowGap"],["Justify items","justify-items","select","justifyItems"],["Align items","align-items","select","alignItems"],["Place items","place-items","text","placeItems"],["Justify content","justify-content","select","justifyContent"],["Align content","align-content","select","alignContent"],["Place content","place-content","text","placeContent"],["Grid area","grid-area","text","gridArea"],["Grid column","grid-column","text","gridColumn"],["Grid row","grid-row","text","gridRow"],["Justify self","justify-self","select","justifySelf"],["Align self","align-self","select","alignSelf"],["Place self","place-self","text","placeSelf"]],
    position:[["Position","position","select","position"],["Inset","inset","text","inset"],["Top","top","text","top"],["Right","right","text","right"],["Bottom","bottom","text","bottom"],["Left","left","text","left"],["Inset inline","inset-inline","text","insetInline"],["Inset block","inset-block","text","insetBlock"],["Inset inline start","inset-inline-start","text","insetInlineStart"],["Inset inline end","inset-inline-end","text","insetInlineEnd"],["Inset block start","inset-block-start","text","insetBlockStart"],["Inset block end","inset-block-end","text","insetBlockEnd"],["Z-index","z-index","text","zIndex"],["Float","float","select","float"],["Clear","clear","select","clear"]],
    effects:[["Opacity","opacity","range","opacity"],["Opacity value","opacity","text","opacity"],["Visibility","visibility","select","visibility"],["Filter","filter","text","filter"],["Backdrop filter","backdrop-filter","text","backdropFilter"],["Mix blend mode","mix-blend-mode","select","mixBlendMode"],["Background blend mode","background-blend-mode","select","backgroundBlendMode"],["Isolation","isolation","select","isolation"],["Clip path","clip-path","text","clipPath"],["Mask","mask","text","mask"],["Mask image","mask-image","text","maskImage"],["Mask size","mask-size","text","maskSize"],["Mask position","mask-position","text","maskPosition"],["Mask repeat","mask-repeat","text","maskRepeat"],["Mask clip","mask-clip","text","maskClip"],["Mask composite","mask-composite","text","maskComposite"],["Box decoration break","box-decoration-break","select","boxDecorationBreak"],["Pointer events","pointer-events","select","pointerEvents"]],
    transform:[["Transform","transform","text","transform"],["Translate","translate","text","translate"],["Rotate","rotate","text","rotate"],["Scale","scale","text","scale"],["Transform origin","transform-origin","text","transformOrigin"],["Transform box","transform-box","select","transformBox"],["Transform style","transform-style","select","transformStyle"],["Backface visibility","backface-visibility","select","backfaceVisibility"],["Perspective","perspective","text","perspective"],["Perspective origin","perspective-origin","text","perspectiveOrigin"]],
    transition:[["Transition shorthand","transition","text","transition"],["Property","transition-property","text","transitionProperty"],["Duration","transition-duration","text","transitionDuration"],["Timing function","transition-timing-function","text","transitionTimingFunction"],["Delay","transition-delay","text","transitionDelay"]],
    animation:[["Animation shorthand","animation","text","animation"],["Name","animation-name","text","animationName"],["Duration","animation-duration","text","animationDuration"],["Timing function","animation-timing-function","text","animationTimingFunction"],["Delay","animation-delay","text","animationDelay"],["Iteration count","animation-iteration-count","text","animationIterationCount"],["Direction","animation-direction","select","animationDirection"],["Fill mode","animation-fill-mode","select","animationFillMode"],["Play state","animation-play-state","select","animationPlayState"],["Timeline","animation-timeline","text","animationTimeline"],["Range","animation-range","text","animationRange"],["Composition","animation-composition","text","animationComposition"]],
    content:[["Cursor","cursor","text","cursor"],["User select","user-select","select","userSelect"],["Appearance","appearance","text","appearance"],["Pointer events","pointer-events","select","pointerEvents"],["Object fit","object-fit","select","objectFit"],["Object position","object-position","text","objectPosition"],["List shorthand","list-style","text","listStyle"],["List style type","list-style-type","text","listStyleType"],["List style image","list-style-image","text","listStyleImage"],["List style position","list-style-position","select","listStylePosition"],["Resize","resize","select","resize"],["Touch action","touch-action","text","touchAction"],["Scroll behavior","scroll-behavior","select","scrollBehavior"],["Text rendering","text-rendering","select","textRendering"]],
    scroll:[["Scroll snap type","scroll-snap-type","text","scrollSnapType"],["Scroll snap align","scroll-snap-align","text","scrollSnapAlign"],["Scroll snap stop","scroll-snap-stop","select","scrollSnapStop"],["Scroll margin","scroll-margin","text","scrollMargin"],["Scroll padding","scroll-padding","text","scrollPadding"],["Overscroll behavior","overscroll-behavior","text","overscrollBehavior"],["Overscroll X","overscroll-behavior-x","select","overscrollBehaviorX"],["Overscroll Y","overscroll-behavior-y","select","overscrollBehaviorY"],["Scrollbar color","scrollbar-color","text","scrollbarColor"],["Scrollbar width","scrollbar-width","select","scrollbarWidth"]],
    svg:[["Fill","fill","text","fill"],["Fill opacity","fill-opacity","text","fillOpacity"],["Fill rule","fill-rule","select","fillRule"],["Stroke","stroke","text","stroke"],["Stroke width","stroke-width","text","strokeWidth"],["Stroke opacity","stroke-opacity","text","strokeOpacity"],["Stroke line cap","stroke-linecap","select","strokeLinecap"],["Stroke line join","stroke-linejoin","select","strokeLinejoin"],["Stroke dash array","stroke-dasharray","text","strokeDasharray"],["Stroke dash offset","stroke-dashoffset","text","strokeDashoffset"],["Vector effect","vector-effect","select","vectorEffect"],["Paint order","paint-order","text","paintOrder"]],
    responsive:[["Container type","container-type","select","containerType"],["Container name","container-name","text","containerName"],["Contain","contain","text","contain"],["Content visibility","content-visibility","select","contentVisibility"],["Contain intrinsic size","contain-intrinsic-size","text","containIntrinsicSize"]],
    custom:[],
    presets:[["Copy style","--visual-copy-style","action"],["Paste style","--visual-paste-style","action"],["Clear element visual styles","--visual-clear-element","action"]]
  };
  const computedProperties=[...new Set(Object.values(specs).flatMap(rows=>rows.map(row=>row[3]).filter(Boolean)))];
  let fallbackOptionListId=0;
  const state={picking:false,visualMode:false,mode:"elements",selector:"",tag:"",computed:{},committed:{},draft:{}};
  const shared=window.Editor1PropertyControls;
  const drafts=shared?shared.createDraftState():null;
  const panel=document.createElement("aside"); panel.id="visual-editor-shell"; panel.hidden=true;
  panel.innerHTML=`<header class="visual-editor-header"><div class="visual-editor-topbar"><span class="visual-editor-brand"><i></i> VISUAL EDITOR</span><span class="visual-editor-selection-status" data-status>Choose an element on canvas</span><button type="button" data-close aria-label="Close Visual Editor">Exit Visual</button></div></header>
  <aside class="visual-editor-right-panel"><nav class="visual-editor-mode-tabs" aria-label="Visual editor modes"><button type="button" data-mode="elements" class="is-active">Elements</button><button type="button" data-mode="settings">Settings</button></nav>
  <section class="visual-editor-elements"><div class="visual-editor-sidehead"><strong>Elements</strong><span>Canvas</span></div><div class="visual-editor-search"><span>⌕</span><input type="search" placeholder="Search elements" disabled aria-label="Element search (not available yet)"></div><div class="visual-editor-group"><small>SELECT</small><button class="visual-editor-pick" data-pick><span class="visual-editor-icon">⌖</span><span><b>Select Element</b><small>Click an item in preview</small></span></button></div><div class="visual-editor-group"><small>RECENTLY USED</small><div class="visual-editor-tilegrid"><div class="visual-editor-tile"><span>▤</span>Text</div><div class="visual-editor-tile"><span>H</span>Heading</div><div class="visual-editor-tile"><span>☷</span>List</div><div class="visual-editor-tile"><span>▣</span>Section</div><div class="visual-editor-tile"><span>▱</span>Container</div><div class="visual-editor-tile"><span>▥</span>Grid</div></div></div><div class="visual-editor-group"><small>MEDIA</small><div class="visual-editor-tilegrid"><div class="visual-editor-tile"><span>▧</span>Image</div><div class="visual-editor-tile"><span>▷</span>Video</div></div></div><p class="visual-editor-note">Element insertion will be connected in a later stage.</section>
  <aside id="visual-inspector"><div class="visual-inspector-head"><div><small>INSPECTOR</small><strong data-title>Visual Settings</strong></div><button type="button" data-close aria-label="Exit Visual Editor">×</button></div>
  <div class="visual-editor-selected" data-selected><span>Selected element</span><b data-element-label>None</b><code data-selector-label>—</code></div>
  <div class="visual-category-grid" data-categories><button data-cat="color"><i>◉</i>Color</button><button data-cat="background"><i>▧</i>Background</button><button data-cat="border"><i>▢</i>Border</button><button data-cat="outline"><i>▱</i>Outline</button><button data-cat="size"><i>↔</i>Size</button><button data-cat="shadow"><i>◩</i>Shadow</button><button data-cat="spacing"><i>⇥</i>Spacing</button><button data-cat="typography"><i>Aa</i>Typography</button><button data-cat="layout"><i>▦</i>Layout</button><button data-cat="flex"><i>⇆</i>Flexbox</button><button data-cat="grid"><i>▦</i>Grid</button><button data-cat="position"><i>⌖</i>Position</button><button data-cat="effects"><i>◐</i>Effects &amp; masks</button><button data-cat="transform"><i>↗</i>Transform</button><button data-cat="transition"><i>◷</i>Transition</button><button data-cat="animation"><i>◴</i>Animation</button><button data-cat="content"><i>≡</i>Content &amp; input</button><button data-cat="scroll"><i>↕</i>Scroll</button><button data-cat="svg"><i>◇</i>SVG</button><button data-cat="responsive"><i>▣</i>Responsive</button><button data-cat="custom"><i>＋</i>Custom CSS</button><button data-cat="presets"><i>✧</i>Presets</button></div>
  <section data-controls hidden></section><div class="visual-actions" data-actions hidden><button data-back>Cancel</button><button data-reset>Reset Category</button><button data-apply>Apply</button></div></aside></aside>`;
  panel.className="visual-editor-shell";
  document.body.appendChild(panel);
  const modeTabs=panel.querySelector(".visual-editor-mode-tabs");
  function setMode(mode){state.mode=mode==="settings"&&state.selector?"settings":"elements";panel.dataset.mode=state.mode;modeTabs.querySelectorAll("[data-mode]").forEach(btn=>{btn.classList.toggle("is-active",btn.dataset.mode===state.mode);if(btn.dataset.mode==="settings")btn.disabled=!state.selector;});}
  function enterVisual(){state.visualMode=true;panel.hidden=false;document.body.classList.add("visual-mode");setMode("elements");state.picking=true;picker(true);window.parent.postMessage({type:"alfacode:visual-mode-active",active:true},"*");}
  function exitVisual(){state.visualMode=false;state.picking=false;panel.hidden=true;document.body.classList.remove("visual-mode");state.draft={...(state.committed[state.selector]||{})};previewCSS(state.committed);picker(false);window.parent.postMessage({type:"alfacode:visual-mode-active",active:false},"*");}
  const title=panel.querySelector("[data-title]"),status=panel.querySelector("[data-status]"),selectedLabel=panel.querySelector("[data-element-label]"),selectorLabel=panel.querySelector("[data-selector-label]"),grid=panel.querySelector("[data-categories]"),controls=panel.querySelector("[data-controls]"),actions=panel.querySelector("[data-actions]");
  function hex(value){const m=String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);return m?"#"+m.slice(1,4).map(x=>Number(x).toString(16).padStart(2,"0")).join(""):"#ffffff";}
  function cssFor(map){return Object.entries(map).map(([sel,props])=>{const lines=Object.entries(props).filter(([k,v])=>!k.startsWith("--visual-")&&v!==""&&v!=null).map(([k,v])=>k+": "+v+";");return lines.length?sel+" {\n  "+lines.join("\n  ")+"\n}":""}).filter(Boolean).join("\n\n");}
  function previewCSS(map){preview.contentWindow?.postMessage({type:"alfacode:visual-preview-css",css:cssFor(map)},"*");}
  function refreshPreviewStyles(){previewCSS(state.committed);}
  function picker(on){preview.contentWindow?.postMessage({type:"alfacode:visual-pick",enabled:on},"*");}
  function draftPreview(){previewCSS({...state.committed,[state.selector]:{...(state.committed[state.selector]||{}),...state.draft}});}
  function showCategories(){grid.hidden=false;controls.hidden=true;actions.hidden=true;if(selectedLabel)selectedLabel.textContent=state.tag||"None";if(selectorLabel)selectorLabel.textContent=state.selector||"—";if(status)status.textContent=state.selector?("Editing "+state.tag+" · "+state.selector):"Choose an element on canvas";title.textContent=state.selector?"Element Settings · "+state.tag:"Select an element";}
  function valueFor(prop,type,computed){if(Object.prototype.hasOwnProperty.call(state.draft,prop))return state.draft[prop];const val=state.computed[computed]||"";return type==="color"?hex(val):val;}
  function validDeclaration(prop,value){
    if(!value.trim())return true;
    if(prop.startsWith("--"))return !/[;{}]/.test(value);
    return !window.CSS?.supports||window.CSS.supports(prop,value);
  }
  const selectOptions={
    'border-style':['none','hidden','solid','dashed','dotted','double','groove','ridge','inset','outset'],'border-image-repeat':['stretch','repeat','round','space'],
    'outline-style':['auto','none','solid','dashed','dotted','double','groove','ridge','inset','outset'],'box-sizing':['content-box','border-box'],
    'overflow':['visible','hidden','clip','scroll','auto'],'overflow-x':['visible','hidden','clip','scroll','auto'],'overflow-y':['visible','hidden','clip','scroll','auto'],
    'background-repeat':['repeat','repeat-x','repeat-y','no-repeat','space','round','repeat no-repeat'],'background-attachment':['scroll','fixed','local'],'background-origin':['border-box','padding-box','content-box'],'background-clip':['border-box','padding-box','content-box','text'],
    'color-scheme':['normal','light','dark','light dark','only light','only dark'],
    'font-style':['normal','italic','oblique'],'text-align':['start','end','left','right','center','justify','match-parent'],'text-align-last':['auto','start','end','left','right','center','justify'],
    'text-transform':['none','capitalize','uppercase','lowercase','full-width','full-size-kana','math-auto'],'text-decoration-style':['solid','double','dotted','dashed','wavy'],
    'white-space':['normal','nowrap','pre','pre-wrap','pre-line','break-spaces'],'text-overflow':['clip','ellipsis'],'word-break':['normal','break-all','keep-all','break-word'],'overflow-wrap':['normal','break-word','anywhere'],'hyphens':['none','manual','auto'],'writing-mode':['horizontal-tb','vertical-rl','vertical-lr','sideways-rl','sideways-lr'],'text-orientation':['mixed','upright','sideways'],'direction':['ltr','rtl'],
    'display':['block','inline','run-in','flow-root','table','flex','grid','ruby','block flow','inline flow','block flow-root','inline flow-root','block flex','inline flex','block grid','inline grid','block table','inline table','table-row','table-cell','table-caption','contents','list-item','none'],
    'float':['none','left','right','inline-start','inline-end'],'clear':['none','left','right','both','inline-start','inline-end'],'column-span':['none','all'],'column-fill':['auto','balance','balance-all'],'break-before':['auto','avoid','page','column','region','left','right','recto','verso'],'break-after':['auto','avoid','page','column','region','left','right','recto','verso'],'break-inside':['auto','avoid','avoid-page','avoid-column','avoid-region'],
    'flex-direction':['row','row-reverse','column','column-reverse'],'flex-wrap':['nowrap','wrap','wrap-reverse'],
    'justify-content':['normal','start','end','center','left','right','flex-start','flex-end','space-between','space-around','space-evenly','stretch'],'justify-items':['normal','start','end','center','stretch','self-start','self-end','left','right','legacy'],'justify-self':['auto','normal','start','end','center','stretch','self-start','self-end','left','right'],
    'align-items':['normal','stretch','start','end','center','flex-start','flex-end','self-start','self-end','baseline','first baseline','last baseline'],'align-content':['normal','start','end','center','flex-start','flex-end','space-between','space-around','space-evenly','stretch','baseline','first baseline','last baseline'],'align-self':['auto','normal','stretch','start','end','center','flex-start','flex-end','self-start','self-end','baseline'],'grid-auto-flow':['row','column','dense','row dense','column dense'],
    'position':['static','relative','absolute','fixed','sticky'],'visibility':['visible','hidden','collapse'],'position-try-fallbacks':['none','flip-block','flip-inline','flip-start'],
    'mix-blend-mode':['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'],'background-blend-mode':['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'],'isolation':['auto','isolate'],
    'pointer-events':['auto','none','visiblePainted','visibleFill','visibleStroke','visible','painted','fill','stroke','all'],'cursor':['auto','default','none','context-menu','help','pointer','progress','wait','cell','crosshair','text','vertical-text','alias','copy','move','no-drop','not-allowed','grab','grabbing','all-scroll','col-resize','row-resize','n-resize','e-resize','s-resize','w-resize','ne-resize','nw-resize','se-resize','sw-resize','ew-resize','ns-resize','nesw-resize','nwse-resize','zoom-in','zoom-out'],
    'animation-direction':['normal','reverse','alternate','alternate-reverse'],'animation-fill-mode':['none','forwards','backwards','both'],'animation-play-state':['running','paused'],
    'object-fit':['fill','contain','cover','none','scale-down'],'list-style-position':['inside','outside'],'appearance':['none','auto','textfield','menulist-button'],
    'resize':['none','both','horizontal','vertical','block','inline'],'scroll-behavior':['auto','smooth'],'scroll-snap-stop':['normal','always'],
    'overscroll-behavior-x':['auto','contain','none'],'overscroll-behavior-y':['auto','contain','none'],'scrollbar-width':['auto','thin','none'],
    'fill-rule':['nonzero','evenodd'],'stroke-linecap':['butt','round','square'],'stroke-linejoin':['miter','round','bevel','arcs'],'vector-effect':['none','non-scaling-stroke','non-scaling-size','non-rotation','fixed-position'],'container-type':['normal','size','inline-size'],'content-visibility':['visible','auto','hidden'],
    'transform-box':['content-box','border-box','fill-box','stroke-box','view-box'],'transform-style':['flat','preserve-3d'],'backface-visibility':['visible','hidden']
  };
  function applyShadowPreset(preset){const presets={none:'none',subtle:'0 2px 8px rgba(0,0,0,.12)',medium:'0 6px 16px rgba(0,0,0,.18)',strong:'0 12px 28px rgba(0,0,0,.28)',glow:'0 0 18px rgba(255,106,34,.55)',inset:'inset 0 2px 8px rgba(0,0,0,.18)'};const value=presets[preset]||'';state.draft['box-shadow']=value;if(drafts)drafts.set('box-shadow',value);draftPreview();}
  function splitShadowLayers(value){
    const layers=[];let start=0,depth=0,quote="",escaped=false;
    for(let i=0;i<value.length;i++){const ch=value[i];if(escaped){escaped=false;continue;}if(ch==="\\"){escaped=true;continue;}if(quote){if(ch===quote)quote="";continue;}if(ch==='"'||ch==="'"){quote=ch;continue;}if(ch==="(")depth++;else if(ch===")")depth--;else if(ch===","&&depth===0){layers.push(value.slice(start,i).trim());start=i+1;}}
    layers.push(value.slice(start).trim());return layers;
  }
  function shadowTokens(value){
    const tokens=[];let start=-1,depth=0,quote="",escaped=false;
    for(let i=0;i<value.length;i++){const ch=value[i];if(escaped){escaped=false;continue;}if(ch==="\\"){escaped=true;if(start<0)start=i;continue;}if(quote){if(ch===quote)quote="";continue;}if(ch==='"'||ch==="'"){quote=ch;if(start<0)start=i;continue;}if(ch==="("){depth++;if(start<0)start=i;}else if(ch===")")depth--;else if(/\s/.test(ch)&&depth===0){if(start>=0){tokens.push(value.slice(start,i));start=-1;}}else if(start<0)start=i;}
    if(start>=0)tokens.push(value.slice(start));return tokens;
  }
  function parseShadowLayers(value,allowInset){
    const source=String(value||"").trim();if(!source||source==="none")return [];
    if(!window.CSS?.supports)return null;
    const layers=splitShadowLayers(source),parsed=[];
    for(const text of layers){
      if(!text)return null;const tokens=shadowTokens(text);let inset=false,color="",lengths=[];
      for(const token of tokens){if(token.toLowerCase()==="inset"&&allowInset){if(inset)return null;inset=true;}else if(!color&&window.CSS.supports("color",token)){color=token;}else lengths.push(token);}
      if((allowInset&&lengths.length<2)||(!allowInset&&lengths.length<2)||lengths.length>(allowInset?4:3))return null;
      parsed.push({inset,color:color||"currentColor",x:lengths[0],y:lengths[1],blur:lengths[2]||"0px",spread:allowInset?(lengths[3]||"0px"):"0px"});
    }
    return parsed;
  }
  function renderShadowControls(){
    const presets={subtle:"0 2px 8px rgba(0,0,0,.12)",medium:"0 6px 16px rgba(0,0,0,.18)",strong:"0 12px 28px rgba(0,0,0,.28)",glow:"0 0 18px rgba(255,106,34,.55)",inset:"inset 0 2px 8px rgba(0,0,0,.18)"};
    const section=document.createElement("div");section.className="visual-shadow-panel";
    function setValue(prop,value,input){state.draft[prop]=value;if(drafts)drafts.set(prop,value);if(input)input.value=value;draftPreview();}
    function makeEditor(prop,label,allowInset){
      const editor=document.createElement("section");editor.className="visual-shadow-editor";
      const heading=document.createElement("h3");heading.textContent=label;editor.appendChild(heading);
      const current=state.draft[prop]??state.committed[state.selector]?.[prop]??state.computed[allowInset?"boxShadow":"textShadow"]??"";
      let layers=parseShadowLayers(current,allowInset);
      const rawLabel=document.createElement("label");rawLabel.className="visual-shadow-raw";
      const rawCaption=document.createElement("span");rawCaption.textContent="CSS value";
      const raw=document.createElement("input");raw.type="text";raw.value=current;raw.placeholder="none or CSS shadow list";raw.setAttribute("aria-label",label+" CSS value");
      raw.addEventListener("input",()=>{const value=raw.value.trim();if(!value){raw.removeAttribute("aria-invalid");setValue(prop,"");return;}if(!window.CSS.supports(prop,value)){raw.setAttribute("aria-invalid","true");return;}raw.removeAttribute("aria-invalid");setValue(prop,raw.value);});
      raw.addEventListener("change",()=>{const parsed=parseShadowLayers(raw.value,allowInset);if(parsed&&(raw.value.trim()===""||window.CSS.supports(prop,raw.value))){layers=parsed;renderLayers();raw.removeAttribute("aria-invalid");}else raw.setAttribute("aria-invalid","true");});
      rawLabel.append(rawCaption,raw);editor.appendChild(rawLabel);
      const layerList=document.createElement("div");layerList.className="visual-shadow-layers";editor.appendChild(layerList);
      function updateLayers(){
        const value=layers.map(layer=>[allowInset&&layer.inset?"inset":"",layer.x||"0px",layer.y||"0px",layer.blur||"0px",allowInset?(layer.spread||"0px"):"",layer.color||"currentColor"].filter(Boolean).join(" ")).join(", ");
        const property=window.CSS?.supports(prop,value)?value:"";
        if(!property&&value){raw.setAttribute("aria-invalid","true");return;}
        raw.removeAttribute("aria-invalid");setValue(prop,property||"none",raw);
      }
      function renderLayers(){
        layerList.replaceChildren();
        if(layers===null){const message=document.createElement("p");message.className="visual-shadow-hint";message.textContent="This value uses CSS syntax that cannot be edited as separate layers. Edit the CSS value above.";layerList.appendChild(message);return;}
        layers.forEach((layer,index)=>{
          const card=document.createElement("div");card.className="visual-shadow-layer";
          const top=document.createElement("div");top.className="visual-shadow-layer-head";
          const name=document.createElement("strong");name.textContent="Layer "+(index+1);top.appendChild(name);
          if(allowInset){const insetLabel=document.createElement("label");insetLabel.className="visual-shadow-inset";const inset=document.createElement("input");inset.type="checkbox";inset.checked=layer.inset;inset.setAttribute("aria-label","Inset shadow layer "+(index+1));inset.addEventListener("change",()=>{layer.inset=inset.checked;updateLayers();});insetLabel.append(inset,document.createTextNode("Inset"));top.appendChild(insetLabel);}
          const remove=document.createElement("button");remove.type="button";remove.textContent="Remove";remove.setAttribute("aria-label","Remove "+label.toLowerCase()+" layer "+(index+1));remove.addEventListener("click",()=>{layers.splice(index,1);renderLayers();updateLayers();});top.appendChild(remove);card.appendChild(top);
          const fields=document.createElement("div");fields.className="visual-shadow-fields";
          const values=[["Offset X","x"],["Offset Y","y"],["Blur","blur"],...(allowInset?[["Spread","spread"]]:[])];
          values.forEach(([caption,key])=>{const field=document.createElement("label");field.className="visual-shadow-field";const text=document.createElement("span");text.textContent=caption;const input=document.createElement("input");input.type="text";input.inputMode="decimal";input.value=layer[key]||"0px";input.placeholder="0px";input.setAttribute("aria-label",caption+" for "+label.toLowerCase()+" layer "+(index+1));input.addEventListener("input",()=>{layer[key]=input.value;updateLayers();});field.append(text,input);fields.appendChild(field);});
          const colorField=document.createElement("label");colorField.className="visual-shadow-field visual-shadow-color";const colorCaption=document.createElement("span");colorCaption.textContent="Color";const colorText=document.createElement("input");colorText.type="text";colorText.value=layer.color||"currentColor";colorText.placeholder="currentColor, rgba(), var()";colorText.setAttribute("aria-label","Color for "+label.toLowerCase()+" layer "+(index+1));
          const colorPicker=document.createElement("input");colorPicker.type="color";colorPicker.value=/^#[0-9a-f]{6}$/i.test(colorText.value)?colorText.value:"#000000";colorPicker.setAttribute("aria-label","Pick color for "+label.toLowerCase()+" layer "+(index+1));
          colorText.addEventListener("input",()=>{layer.color=colorText.value;updateLayers();if(/^#[0-9a-f]{6}$/i.test(colorText.value))colorPicker.value=colorText.value;});
          colorPicker.addEventListener("input",()=>{layer.color=colorPicker.value;colorText.value=colorPicker.value;updateLayers();});
          colorField.append(colorCaption,colorText,colorPicker);fields.appendChild(colorField);card.appendChild(fields);layerList.appendChild(card);
        });
      }
      const actions=document.createElement("div");actions.className="visual-shadow-actions";
      const add=document.createElement("button");add.type="button";add.textContent="Add shadow layer";add.addEventListener("click",()=>{if(layers===null){raw.setAttribute("aria-invalid","true");return;}layers.push({inset:false,x:"0px",y:"4px",blur:"12px",spread:"0px",color:"rgba(0, 0, 0, 0.25)"});renderLayers();updateLayers();});
      const clear=document.createElement("button");clear.type="button";clear.textContent="Clear";clear.addEventListener("click",()=>{layers=[];renderLayers();updateLayers();});
      actions.append(add,clear);editor.appendChild(actions);
      const hint=document.createElement("p");hint.className="visual-shadow-hint";hint.textContent=allowInset?"Multiple layers, inset, negative offsets, CSS lengths and color functions are supported.":"Multiple layers, negative offsets, CSS lengths and color functions are supported.";editor.appendChild(hint);
      renderLayers();return editor;
    }
    section.append(makeEditor("box-shadow","Box shadow",true),makeEditor("text-shadow","Text shadow",false));
    const presetsPanel=document.createElement("div");presetsPanel.className="visual-shadow-presets";
    const presetTitle=document.createElement("strong");presetTitle.textContent="Box shadow presets";presetsPanel.appendChild(presetTitle);
    Object.entries(presets).forEach(([name,value])=>{const button=document.createElement("button");button.type="button";button.textContent=name[0].toUpperCase()+name.slice(1);button.addEventListener("click",()=>{applyShadowPreset(name);controls.replaceChildren();renderShadowControls();});presetsPanel.appendChild(button);});
    section.appendChild(presetsPanel);controls.appendChild(section);
  }
  function makeControl(row){
    const [label,prop,type,computed]=row,val=valueFor(prop,type,computed),options=selectOptions[prop]||[];
    const change=(input,value)=>{if(!validDeclaration(prop,value)){input.setAttribute("aria-invalid","true");return;}input.removeAttribute("aria-invalid");state.draft[prop]=value;if(drafts)drafts.set(prop,value);draftPreview();};
    if(shared){const field=shared.createField({label,value:val,type,options,min:type==='range'?0:undefined,max:type==='range'?1:undefined,step:type==='range'?.01:undefined,onChange:value=>change(field.input,value)});field.input.setAttribute('aria-label',label);field.input.title=label;return field.element;}
    const wrap=document.createElement('label');wrap.className='visual-control-row';const caption=document.createElement('span');caption.textContent=label;let input;
    if(type==='select'){input=document.createElement('input');input.type='text';const list=document.createElement('datalist');list.id="visual-options-"+(++fallbackOptionListId);options.forEach(v=>{const o=document.createElement('option');o.value=v;list.appendChild(o);});input.setAttribute("list",list.id);wrap.appendChild(list);}else{input=document.createElement('input');input.type=type;if(type==='range'){input.min=0;input.max=1;input.step=.01;}}
    input.value=val;input.setAttribute('aria-label',label);input.title=label;wrap.append(caption,input);
    if(type==='range'){const output=document.createElement('output');output.textContent=Math.round(Number(input.value||0)*100)+'%';wrap.appendChild(output);input.addEventListener('input',()=>output.textContent=Math.round(Number(input.value)*100)+'%');}
    const onChange=()=>change(input,input.value);input.addEventListener('input',onChange);input.addEventListener('change',onChange);return wrap;
  }
  const managedProperties=new Set(Object.values(specs).flatMap(rows=>rows.map(row=>row[1])));
  function renderCustomControls(){
    const section=document.createElement("div");section.className="visual-custom-panel";
    const note=document.createElement("p");note.className="visual-shadow-hint";note.textContent="Edit any CSS property, including custom properties. Values are previewed live and applied only when you choose Apply.";section.appendChild(note);
    const rows=document.createElement("div");rows.className="visual-custom-rows";section.appendChild(rows);
    function addRow(property="",value=""){
      const row=document.createElement("div");row.className="visual-custom-row";
      const propertyInput=document.createElement("input");propertyInput.type="text";propertyInput.value=property;propertyInput.placeholder="CSS property (e.g. filter or --brand-color)";propertyInput.setAttribute("aria-label","Custom CSS property");
      const valueInput=document.createElement("input");valueInput.type="text";valueInput.value=value;valueInput.placeholder="CSS value";valueInput.setAttribute("aria-label","Custom CSS value");
      const remove=document.createElement("button");remove.type="button";remove.textContent="Remove";remove.setAttribute("aria-label","Remove custom CSS declaration");
      let activeProperty=property;
      function update(){
        const nextProperty=propertyInput.value.trim(),nextValue=valueInput.value.trim();
        if(!/^(--[a-zA-Z0-9_-]+|-?[a-zA-Z][a-zA-Z0-9-]*)$/.test(nextProperty)||!validDeclaration(nextProperty,nextValue)){
          propertyInput.toggleAttribute("aria-invalid",!/^(--[a-zA-Z0-9_-]+|-?[a-zA-Z][a-zA-Z0-9-]*)$/.test(nextProperty));
          valueInput.toggleAttribute("aria-invalid",!validDeclaration(nextProperty,nextValue));return;
        }
        propertyInput.removeAttribute("aria-invalid");valueInput.removeAttribute("aria-invalid");
        if(activeProperty&&activeProperty!==nextProperty){state.draft[activeProperty]="";if(drafts)drafts.set(activeProperty,"");}
        activeProperty=nextProperty;if(activeProperty){state.draft[activeProperty]=nextValue;if(drafts)drafts.set(activeProperty,nextValue);draftPreview();}
      }
      propertyInput.addEventListener("input",update);valueInput.addEventListener("input",update);
      remove.addEventListener("click",()=>{if(activeProperty){state.draft[activeProperty]="";if(drafts)drafts.set(activeProperty,"");draftPreview();}row.remove();});
      row.append(propertyInput,valueInput,remove);rows.appendChild(row);
    }
    const customProps=new Set([...Object.keys(state.committed[state.selector]||{}),...Object.keys(state.draft)]);customProps.forEach(prop=>{if(!managedProperties.has(prop)&&!prop.startsWith("--visual-")&&(state.draft[prop]??state.committed[state.selector]?.[prop]))addRow(prop,state.draft[prop]??state.committed[state.selector]?.[prop]??"");});
    const add=document.createElement("button");add.type="button";add.className="visual-custom-add";add.textContent="Add CSS declaration";add.addEventListener("click",()=>addRow());section.appendChild(add);
    controls.appendChild(section);
  }
  function resetCategory(cat){
    const props=cat==="custom"?[...new Set([...Object.keys(state.committed[state.selector]||{}),...Object.keys(state.draft)])].filter(prop=>!managedProperties.has(prop)&&!prop.startsWith("--visual-")):specs[cat].map(row=>row[1]).filter(prop=>!prop.startsWith('--visual-'));
    props.forEach(prop=>{state.draft[prop]='';if(drafts)drafts.set(prop,'');});
    props.forEach(prop=>delete state.committed[state.selector]?.[prop]);
    controls.replaceChildren();if(cat==='color')renderColorControls();else if(cat==='presets')renderPresetControls();else if(cat==='shadow')renderShadowControls();else if(cat==='custom')renderCustomControls();else specs[cat].forEach(row=>controls.appendChild(makeControl(row)));
    draftPreview();sendCSS(props);
  }
  function currentColor(prop,computedKey){const value=state.draft[prop]??state.committed[state.selector]?.[prop]??state.computed[computedKey]??"#ffffff";return hex(value);}
  function setColorProperty(prop,value){state.draft[prop]=value;if(drafts)drafts.set(prop,value);draftPreview();}
  function renderColorControls(){
    const section=document.createElement("div");section.className="visual-color-panel";
    const swatches=["#111827","#ffffff","#f97316","#7c3aed","#2563eb","#16a34a","#ef4444","#eab308","#ec4899","#06b6d4"];
    function addColorRow(label,prop,computedKey){
      const row=document.createElement("div");row.className="visual-color-row";
      const heading=document.createElement("span");heading.textContent=label;
      const current=state.draft[prop]??state.committed[state.selector]?.[prop]??state.computed[computedKey]??"#ffffff";
      const picker=document.createElement("input");picker.type="color";picker.value=currentColor(prop,computedKey);picker.setAttribute("aria-label",label+" color picker");
      const text=document.createElement("input");text.type="text";text.value=current;text.placeholder="#RRGGBB, rgb(), hsl(), color-mix(), var()";text.setAttribute("aria-label",label+" CSS color");
      const applyValue=value=>{if(!value.trim()||window.CSS?.supports("color",value)){text.removeAttribute("aria-invalid");if(/^#[0-9a-f]{6}$/i.test(value))picker.value=value;setColorProperty(prop,value);}else{text.setAttribute("aria-invalid","true");}};
      picker.addEventListener("input",()=>applyValue(picker.value));text.addEventListener("input",()=>applyValue(text.value.trim()));
      row.append(heading,picker,text);section.appendChild(row);
    }
    addColorRow("Background","background-color","backgroundColor");
    addColorRow("Text","color","color");
    addColorRow("Border","border-color","borderColor");
    const alphaRow=document.createElement("div");alphaRow.className="visual-color-row visual-alpha-row";
    const alphaLabel=document.createElement("span");alphaLabel.textContent="Opacity";
    const alpha=document.createElement("input");alpha.type="range";alpha.min="0";alpha.max="1";alpha.step="0.01";alpha.value=state.draft.opacity??state.committed[state.selector]?.opacity??state.computed.opacity??1;
    const alphaValue=document.createElement("output");alphaValue.textContent=Math.round(Number(alpha.value)*100)+"%";
    alpha.addEventListener("input",()=>{alphaValue.textContent=Math.round(Number(alpha.value)*100)+"%";setColorProperty("opacity",alpha.value);});
    alphaRow.append(alphaLabel,alpha,alphaValue);section.appendChild(alphaRow);
    const swatchTitle=document.createElement("small");swatchTitle.textContent="Quick palette";section.appendChild(swatchTitle);
    const palette=document.createElement("div");palette.className="visual-color-swatches";
    swatches.forEach(color=>{const b=document.createElement("button");b.type="button";b.title=color;b.style.background=color;b.setAttribute("aria-label","Set background "+color);b.addEventListener("click",()=>{const picker=section.querySelector('input[aria-label="Background color picker"]');const hexInput=section.querySelector('input[aria-label="Background CSS color"]');picker.value=color;hexInput.value=color;setColorProperty("background-color",color);});palette.appendChild(b);});
    section.appendChild(palette);
    const gradientTitle=document.createElement("small");gradientTitle.textContent="Gradient background";section.appendChild(gradientTitle);
    const gradientRow=document.createElement("div");gradientRow.className="visual-gradient-row";
    const mode=document.createElement("select");["None","Linear","Radial"].forEach(v=>{const option=document.createElement("option");option.value=v.toLowerCase();option.textContent=v;mode.appendChild(option);});
    const angle=document.createElement("input");angle.type="number";angle.value="135";angle.min="0";angle.max="360";angle.setAttribute("aria-label","Gradient angle");
    const g1=document.createElement("input");g1.type="color";g1.value="#7c3aed";g1.setAttribute("aria-label","Gradient start color");
    const g2=document.createElement("input");g2.type="color";g2.value="#111827";g2.setAttribute("aria-label","Gradient end color");
    const updateGradient=()=>{let val="";if(mode.value==="linear")val="linear-gradient("+angle.value+"deg, "+g1.value+", "+g2.value+")";if(mode.value==="radial")val="radial-gradient(circle, "+g1.value+", "+g2.value+")";setColorProperty("background-image",val);};
    [mode,angle,g1,g2].forEach(el=>el.addEventListener("input",updateGradient));gradientRow.append(mode,angle,g1,g2);section.appendChild(gradientRow);
    specs.color.slice(4).forEach(row=>section.appendChild(makeControl(row)));
    controls.appendChild(section);
  }
  let copiedStyle=null;
  function renderPresetControls(){
    const section=document.createElement("div");section.className="visual-preset-panel";
    const copy=document.createElement("button");copy.type="button";copy.textContent="Copy visual style";copy.addEventListener("click",()=>{copiedStyle={...(state.committed[state.selector]||state.draft||{})};copy.textContent="Style copied";});
    const paste=document.createElement("button");paste.type="button";paste.textContent="Paste visual style";paste.addEventListener("click",()=>{if(!copiedStyle)return;state.draft={...copiedStyle};if(drafts)drafts.begin(state.draft);draftPreview();paste.textContent="Style pasted";});
    const clear=document.createElement("button");clear.type="button";clear.textContent="Clear element visual styles";clear.addEventListener("click",()=>{const removed=Object.keys(state.committed[state.selector]||{});state.draft={};state.committed[state.selector]={};if(drafts)drafts.begin({});previewCSS(state.committed);sendCSS(removed);clear.textContent="Element styles cleared";});
    section.append(copy,paste,clear);controls.appendChild(section);
  }
  function openCategory(cat){state.draft={...(state.committed[state.selector]||{})};if(drafts)drafts.begin(state.draft);controls.replaceChildren();if(cat==="color")renderColorControls();else if(cat==="presets")renderPresetControls();else if(cat==="shadow")renderShadowControls();else if(cat==="custom")renderCustomControls();else specs[cat].forEach(row=>controls.appendChild(makeControl(row)));grid.hidden=true;controls.hidden=false;actions.hidden=false;title.textContent=cat[0].toUpperCase()+cat.slice(1);}
  function sendCSS(removals=[]){window.parent.postMessage({type:"alfacode:visual-css-update",css:cssFor(state.committed),removals,selector:state.selector},"*");}
  panel.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.matches("[data-mode]")){setMode(b.dataset.mode);if(state.mode==="elements"){grid.hidden=true;controls.hidden=true;actions.hidden=true;}return;}if(b.matches("[data-pick]")){state.picking=true;setMode("elements");title.textContent="Select an element";grid.hidden=true;controls.hidden=true;actions.hidden=true;if(status)status.textContent="Click an element in the preview";picker(true);return;}if(b.matches("[data-close]")){exitVisual();return;}if(b.dataset.cat){setMode("settings");openCategory(b.dataset.cat);}if(b.matches("[data-back]")){state.draft={...(state.committed[state.selector]||{})};if(drafts)state.draft=drafts.cancel();draftPreview();showCategories();}if(b.matches("[data-reset]")){const active=title.textContent.toLowerCase();const cat=Object.keys(specs).find(k=>k===active);if(cat)resetCategory(cat);}if(b.matches("[data-apply]")){state.committed[state.selector]={...(state.committed[state.selector]||{}),...(drafts?drafts.commit():state.draft)};sendCSS();showCategories();}});
  window.addEventListener("message",e=>{if(e.source!==window.parent||!e.data)return;if(e.data.type==="alfacode:visual-toggle"){if(state.visualMode)exitVisual();else enterVisual();}});
  window.addEventListener("message",e=>{if(e.source!==preview.contentWindow||e.data?.type!=="alfacode:visual-selected")return;state.selector=e.data.selector||"";state.tag=e.data.tag||"";state.computed=e.data.computed||{};state.picking=false;panel.hidden=false;setMode("settings");picker(false);showCategories();});
  function pickerScript(){return `<script>
    (() => {
      let picking=false,hovered=null,identityTip=null;
      const marker=document.createElement("style");
      marker.textContent=".editor1-visual-hover{outline:2px solid #7967ed!important;outline-offset:2px!important;cursor:crosshair!important}#editor1-visual-identity-tip{position:fixed;z-index:2147483647;display:none;max-width:280px;padding:5px 8px;border:1px solid #6d63cf;border-radius:6px;background:#171820;color:#f1f1f5;font:11px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;box-shadow:0 5px 16px #0006;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#editor1-visual-identity-tip[data-visible=true]{display:block}";
      document.head.appendChild(marker);
      identityTip=document.createElement("div");identityTip.id="editor1-visual-identity-tip";identityTip.setAttribute("aria-hidden","true");document.body.appendChild(identityTip);
      function hideIdentity(){if(identityTip){identityTip.style.display="none";identityTip.dataset.visible="false";identityTip.textContent="";identityTip.title="";}}
      function identityFor(el){const id=el.id?("#"+el.id):"",classes=[...el.classList].filter(c=>!c.startsWith("editor1-visual")).map(c=>"."+c).join(" ");return id&&classes?id+" "+classes:id||classes||el.tagName.toLowerCase();}
      function moveIdentity(e){if(!identityTip||!hovered||!picking)return;identityTip.textContent=identityFor(hovered);identityTip.title=identityTip.textContent;identityTip.style.display="block";identityTip.dataset.visible="true";const rect=identityTip.getBoundingClientRect(),pad=12;let x=e.clientX+14,y=e.clientY+16;if(x+rect.width>innerWidth-pad)x=e.clientX-rect.width-14;if(y+rect.height>innerHeight-pad)y=e.clientY-rect.height-14;x=Math.max(pad,Math.min(x,innerWidth-rect.width-pad));y=Math.max(pad,Math.min(y,innerHeight-rect.height-pad));identityTip.style.left=x+"px";identityTip.style.top=y+"px";}
      function selector(el){if(el===document.body)return "body";if(el.id)return "#"+CSS.escape(el.id);const parts=[];while(el&&el.nodeType===1&&el!==document.body){let part=el.tagName.toLowerCase();const classes=[...el.classList].filter(c=>!c.startsWith("editor1-visual")).slice(0,2);if(classes.length)part+=classes.map(c=>"."+CSS.escape(c)).join("");const parent=el.parentElement;if(parent){const siblings=[...parent.children].filter(s=>s.tagName===el.tagName);if(siblings.length>1)part+=":nth-of-type("+(siblings.indexOf(el)+1)+")";}parts.unshift(part);el=parent;}return parts.length?"body > "+parts.join(" > "):"body";}
      function clear(){if(hovered)hovered.classList.remove("editor1-visual-hover");hovered=null;hideIdentity();}
      document.addEventListener("mouseover",e=>{if(!picking||!(e.target instanceof Element)||e.target.closest("#visual-inspector"))return;if(hovered!==e.target)clear();hovered=e.target;hovered.classList.add("editor1-visual-hover");moveIdentity(e);},true);
      document.addEventListener("pointermove",e=>{if(picking&&hovered)moveIdentity(e);},true);
      document.addEventListener("pointerleave",e=>{if(e.target===document.documentElement||e.target===document.body)clear();},true);
      document.addEventListener("click",e=>{
        if(!picking||!(e.target instanceof Element)||e.target.closest("#visual-inspector"))return;
        const el=e.target;e.preventDefault();e.stopPropagation();picking=false;clear();
        const s=getComputedStyle(el),computed={};
        ${JSON.stringify(computedProperties)}.forEach(k=>computed[k]=s[k]);
        parent.postMessage({type:"alfacode:visual-selected",selector:selector(el),tag:el.tagName.toLowerCase(),computed},"*");
      },true);
      window.addEventListener("message",e=>{if(e.data?.type==="alfacode:visual-preview-css"){let st=document.getElementById("editor1-visual-preview-styles");if(!st){st=document.createElement("style");st.id="editor1-visual-preview-styles";document.head.appendChild(st);}st.textContent=e.data.css||"";}if(e.data?.type==="alfacode:visual-pick"){picking=!!e.data.enabled;document.body.style.cursor=picking?"crosshair":"";if(!picking)clear();else hideIdentity();}});
    })();
        ` + "</" + "script>";}
  function loadGeneratedCSS(cssText){
    const start="/* Editor1 Visual Styles - Start */",end="/* Editor1 Visual Styles - End */";
    const block=String(cssText||"").split(start)[1]?.split(end)[0]||"";
    const parsed={};
    const rule=/([^{}]+)\{([^{}]*)\}/g;let match;
    while((match=rule.exec(block))){const selector=match[1].trim(),props={};match[2].split(";").forEach(decl=>{const colon=decl.indexOf(":");if(colon>0){const key=decl.slice(0,colon).trim(),value=decl.slice(colon+1).trim();if(key&&value)props[key]=value;}});if(selector&&Object.keys(props).length)parsed[selector]=props;}
    state.committed=parsed;
  }
  preview.addEventListener("load",refreshPreviewStyles);
  window.Editor1VisualEditor={refreshPreviewStyles,pickerScript,loadGeneratedCSS};
})();