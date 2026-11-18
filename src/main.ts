import {desk} from "@shared/desk";

type S={phase:string;pattern:number[];answer:number[];last:number;notice:string};
const init=():S=>({phase:"Compose",pattern:[],answer:[],last:0,notice:"Tap at least 3 beats"});
desk<S>({name:"Duet Grid",accent:"#B695F0",motion:{"motif":"interval","color":"#B695F0","shine":"#F8E8FF"},initial:init,render:s=>({title:s.phase,value:s.phase==="Echo"?s.answer.length+"/"+s.pattern.length:s.phase==="Passed"?"Matched":s.phase==="Miss"?"Try again":(s.pattern.length+Number(!!s.last))+" beats",
 lines:[s.notice,"Target: "+(s.pattern.length+1)+" taps","Tolerance 25% / 120ms","Click: tap pulse","Start: pass or replay","Hold Start: new round"]}),
 action:(s,k,now)=>{if(k==="hold-start"){Object.assign(s,init());return;}
 if(k==="start"){if(s.phase==="Compose"&&s.pattern.length<2){s.notice="Need at least 3 taps";return;}
 if(s.phase==="Passed"){s.phase="Extend";s.notice="Tap twice: add interval";}else{s.phase="Echo";s.notice="Other player: repeat";}s.answer=[];s.last=0;return;}
 if(k!=="ok"||s.phase==="Passed"||s.phase==="Miss")return;
 if(!s.last){s.last=now;return;}const delta=now-s.last;if(delta<80)return;s.last=now;
 if(s.phase==="Compose"||s.phase==="Extend"){if(s.pattern.length<11)s.pattern.push(Math.min(5000,delta));
 if(s.phase==="Extend"){s.phase="Echo";s.last=0;s.notice="Repeat extended pattern";}return;}
 s.answer.push(delta);const index=s.answer.length-1,target=s.pattern[index];
 if(Math.abs(delta-target)>Math.max(120,target*0.25)){s.phase="Miss";s.notice="Mismatch on gap "+(index+1);}
 else if(s.answer.length===s.pattern.length){s.phase="Passed";s.notice="Start: add a beat";}}});
