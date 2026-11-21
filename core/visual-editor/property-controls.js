// #property-controls.js: ساخت کنترل‌های تنظیم پراپرتی‌های بصری
/* Editor1 Visual Editor shared property controls.
 * Centralizes field rendering and draft-state behavior for all inspector categories.
 */
(() => {
  "use strict";
  const clone = value => ({...(value||{})});
  let listId=0;
  function createDraftState(){
    let base={},values={};
    return {
      begin(source){base=clone(source);values=clone(source);return this.values;},
      get values(){return values;},
      set(property,value){values[property]=value;return values;},
      commit(){base=clone(values);return clone(values);},
      cancel(){values=clone(base);return clone(values);},
      reset(properties){if(Array.isArray(properties))properties.forEach(p=>values[p]="");else values={};return clone(values);},
      snapshot(){return clone(values);}
    };
  }
  function createField({label,value,type="text",options=[],min,max,step,onChange}){
    const wrap=document.createElement("label");wrap.className="visual-control-row";
    const caption=document.createElement("span");caption.textContent=label;
    let input;
    if(type==="select"){
      input=document.createElement("input");input.type="text";
      const list=document.createElement("datalist");list.id="visual-property-options-"+(++listId);
      options.forEach(item=>{const option=document.createElement("option");option.value=item;list.appendChild(option);});
      input.setAttribute("list",list.id);wrap.appendChild(list);
    }else{
      input=document.createElement("input");input.type=type;
      if(min!==undefined)input.min=min;if(max!==undefined)input.max=max;if(step!==undefined)input.step=step;
    }
    input.value=value==null?"":String(value);
    wrap.append(caption,input);
    let output;
    if(type==="range"){output=document.createElement("output");output.textContent=input.value;wrap.appendChild(output);}
    const emit=()=>{if(output)output.textContent=input.value;if(onChange)onChange(input.value);};
    input.addEventListener("input",emit);input.addEventListener("change",emit);
    return {element:wrap,input,setValue(v){input.value=v==null?"":String(v);if(output)output.textContent=input.value;}};
  }
  window.Editor1PropertyControls={createDraftState,createField};
})();
