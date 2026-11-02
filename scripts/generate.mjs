// Caelora Academy — deterministic synthetic-data generator (Node.js 18+)
// Run: node scripts/generate.mjs
// Data is wholly fictional and includes no real school records.
import { writeFileSync, mkdirSync } from "node:fs";
function buildData(){
  const seed=20261102; let z=seed>>>0;
  const rand=()=>{z=(z+0x6D2B79F5)>>>0;let t=z;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
  const ri=(a,b)=>Math.floor(rand()*(b-a+1))+a, choose=a=>a[Math.floor(rand()*a.length)], cap=(x,l,h)=>Math.max(l,Math.min(h,x));
  const round1=x=>Math.round(x*10)/10;
  const years=["2023-24","2024-25","2025-26"], targets=[392,407,423];
  const grades=Array.from({length:13},(_,i)=>i), band=g=>g<=5?"Elementary School":g<=8?"Middle School":"High School";
  const weights=[1.13,1.13,1.13,1.08,1.08,1.03,1,1,1,.98,.91,.86,.82];
  const quota=target=>{let w=weights.reduce((a,b)=>a+b,0);let v=weights.map(x=>Math.floor(target*x/w));while(v.reduce((a,b)=>a+b,0)<target)v[v.reduce((a,b)=>a+b,0)%13]++;return v};
  const students=[],families=[], enrollments=[],admissions=[],surveys=[], invitations=[],academics=[];
  let sid=0,fid=0,aid=0,rid=0;const studentById=new Map(),familyMembers=new Map();
  const addStudent=(g,year)=>{let existing=[...familyMembers.keys()].filter(k=>familyMembers.get(k)<2);let family=existing.length&&rand()<.24?choose(existing):null;
    if(!family){family=`F${String(++fid).padStart(4,"0")}`;families.push({family_id:family,first_year:year});familyMembers.set(family,0);}
    familyMembers.set(family,familyMembers.get(family)+1);
    let id=`S${String(++sid).padStart(4,"0")}`,o={student_id:id,family_id:family,first_enrolled:year};students.push(o);studentById.set(id,o);return {student_id:id,grade:g};};
  let roster=[];const initial=quota(targets[0]);
  for(let g=0;g<13;g++)for(let j=0;j<initial[g];j++)roster.push(addStudent(g,years[0]));
  const enroll=(r,year,isReturn)=>{let g=r.grade;enrollments.push({student_id:r.student_id,school_year:year,grade:g,grade_band:band(g),returning_student:isReturn,tuition_assessed_usd:Math.round((g>=9?13350:g>=6?11900:10400)*(1+(years.indexOf(year)*.032)))/1,aid_usd:rand()<.29?ri(800,4100):0});};
  roster.forEach(r=>enroll(r,years[0],null));
  const channels=["Referral","Website","Community event","Search","Other"];
  for(let y=1;y<3;y++){
    const next=[],yr=years[y],newStudents=[];
    for(const old of roster){if(old.grade===12)continue;let p=(old.grade>=9?.88:old.grade>=6?.91:.94)-(y===2&&old.grade>=9?.015:0);
      if(rand()<p) next.push({student_id:old.student_id,grade:old.grade+1});}
    const q=quota(targets[y]);let byGrade=Array(13).fill(0);next.forEach(s=>byGrade[s.grade]++);
    for(let g=0;g<13;g++){const needed=Math.max(0,q[g]-byGrade[g]);for(let k=0;k<needed;k++){let newcomer=addStudent(g,yr);newStudents.push(newcomer);next.push(newcomer);}}
    // If rollover cohorts exceed quotas, keep those students; targets are approximate.
    for(const s of next) enroll(s,yr,!newStudents.some(n=>n.student_id===s.student_id));
    const acceptedNotEnrolled=Math.ceil(newStudents.length*.45),rejected=Math.ceil(newStudents.length*.5),inquiryOnly=Math.ceil(newStudents.length*.9);
    for(const s of newStudents)admissions.push({inquiry_id:`A${String(++aid).padStart(5,"0")}`,school_year:yr,grade_applied:s.grade,source:choose(channels),stage:"enrolled",student_id:s.student_id});
    for(let k=0;k<acceptedNotEnrolled;k++)admissions.push({inquiry_id:`A${String(++aid).padStart(5,"0")}`,school_year:yr,grade_applied:ri(0,12),source:choose(channels),stage:"accepted_not_enrolled",student_id:null});
    for(let k=0;k<rejected;k++)admissions.push({inquiry_id:`A${String(++aid).padStart(5,"0")}`,school_year:yr,grade_applied:ri(0,12),source:choose(channels),stage:"applied_not_accepted",student_id:null});
    for(let k=0;k<inquiryOnly;k++)admissions.push({inquiry_id:`A${String(++aid).padStart(5,"0")}`,school_year:yr,grade_applied:ri(0,12),source:choose(channels),stage:"inquiry_only",student_id:null});
    roster=next;
  }
  function score(group,bandName,yearIndex){
    const upper=bandName==="High School", lower=bandName==="Elementary School";
    const bias=(rand()+rand()+rand()-1.5)*.9;
    const normal=()=>rand()+rand()+rand()-1.5;
    const adj=group==="Faculty"?.12:group==="Student"?-.18:0;
    const toLikert=x=>cap(Math.round(x+bias+normal()*.72),1,5);
    const academic=toLikert(3.84+adj+(yearIndex*.07)-(upper?.12:0));
    const character=toLikert(4.05+adj+(lower?.08:0));
    const partner=toLikert(3.61+adj-(upper?.42:0)+(yearIndex*.02));
    const overall=toLikert((academic+character+partner)/3+.12+normal()*.42);
    const recommend=cap(Math.round((overall-1)*2.1+1+normal()*.7),0,10);
    return {academic_growth:academic,character_culture:character,family_partnership:partner,overall_experience:overall,recommend_0_10:recommend};
  }
  for(let yi=0;yi<3;yi++){
    let year=years[yi],rows=enrollments.filter(e=>e.school_year===year);
    let familyBand=new Map();
    rows.forEach(e=>{let f=studentById.get(e.student_id).family_id;let prev=familyBand.get(f);if(!prev||e.grade>prev.grade)familyBand.set(f,{grade:e.grade,band:e.grade_band});});
    const pool=[];
    for(const [id,v] of familyBand)pool.push({stakeholder:"Parent",grade_band:v.band});
    for(const e of rows.filter(e=>e.grade>=6))pool.push({stakeholder:"Student",grade_band:e.grade_band});
    for(let s=0;s<38+yi*3;s++)pool.push({stakeholder:"Faculty",grade_band:"All"});
    const groups=["Parent","Student","Faculty"],bands=["Elementary School","Middle School","High School","All"];
    for(const st of groups)for(const b of bands){
      let invited=pool.filter(p=>p.stakeholder===st&&p.grade_band===b).length;if(!invited)continue;
      let pct=st==="Parent"?(b==="High School"?.43:.59):st==="Student"?.64:.78;
      const responded=Array.from({length:invited},()=>rand()<pct).filter(Boolean).length;
      invitations.push({school_year:year,stakeholder:st,grade_band:b,invited,responded});
      for(let k=0;k<responded;k++)surveys.push({response_id:`R${String(++rid).padStart(5,"0")}`,school_year:year,stakeholder:st,grade_band:b,...score(st,b,yi)});
    }
    for(let g=3;g<=10;g++){
      let n=rows.filter(e=>e.grade===g).length, assessed=Math.max(1,Math.round(n*(.84+rand()*.13)));
      let pm=cap(.57+yi*.038-(g>=9?.11:0)+((rand()-.5)*.12),.18,.95);
      let pr=cap(.65+yi*.023-(g>=9?.075:0)+((rand()-.5)*.12),.18,.95);
      let math=0,read=0;
      for(let k=0;k<assessed;k++){if(rand()<pm)math++;if(rand()<pr)read++;}
      academics.push({school_year:year,grade:g,grade_band:band(g),students_assessed:assessed,math_met_benchmark:math,reading_met_benchmark:read});
    }
  }
  return {metadata:{school:"Caelora Academy",fictional:true,seed,generated_as_of:"2026-11-02",description:"Fully synthetic, independently generated sample data; no actual pupils, households, school records or client results.",pillars:[{key:"academic_growth",label:"Academic Growth"},{key:"character_culture",label:"Character & Culture"},{key:"family_partnership",label:"Family Partnership"}],years},students,families,enrollments,admissions,survey_invitations:invitations,survey_responses:surveys,academic_benchmarks:academics};
}
function enrichSchoolData(out){
  const schoolLevels=[{label:"Elementary School",grades:"K–5",prefix:"EL",base:18},{label:"Middle School",grades:"6–8",prefix:"MS",base:9},{label:"High School",grades:"9–12",prefix:"HS",base:11}];
  function level(s){return s==="Lower School"?"Elementary School":s==="Upper School"?"High School":s;}
  for (const e of out.enrollments)e.grade_band=level(e.grade_band);
  for (const a of out.academic_benchmarks)a.grade_band=level(a.grade_band);
  for (const s of out.survey_responses){s.grade_band=level(s.grade_band);if(s.stakeholder==="Staff")s.stakeholder="Faculty";}
  for (const i of out.survey_invitations){i.grade_band=level(i.grade_band);if(i.stakeholder==="Staff")i.stakeholder="Faculty";}
  const facultyRoster=[];
  const revisedInv=[];
  for(let yi=0;yi<out.metadata.years.length;yi++){
    const year=out.metadata.years[yi];
    const originalInv=out.survey_invitations.find(x=>x.school_year===year&&x.stakeholder==="Faculty"&&x.grade_band==="All");
    if(!originalInv)throw Error("Missing original faculty source for "+year);
    const cohort=out.survey_responses.filter(x=>x.school_year===year&&x.stakeholder==="Faculty"&&x.grade_band==="All");
    if(cohort.length!==originalInv.responded)throw Error("Unmatched faculty responses "+year);
    const levels=schoolLevels.map(l=>({...l,count:l.base+yi}));
    const total=levels.reduce((n,l)=>n+l.count,0);
    if(total!==originalInv.invited)throw Error("Faculty invitation total mismatch: "+year);
    const desired=levels.map(l=>l.count*cohort.length/total);
    const alloc=desired.map(x=>Math.floor(x));let left=cohort.length-alloc.reduce((a,b)=>a+b,0);
    const order=levels.map((_,j)=>j).sort((a,b)=>(desired[b]-alloc[b])-(desired[a]-alloc[a]));
    for(let j=0;j<left;j++)alloc[order[j%order.length]]++;
    let cursor=0;
    for(let j=0;j<levels.length;j++){
      const l=levels[j];if(alloc[j]>l.count)throw Error("Response count exceeds invitations");
      revisedInv.push({school_year:year,stakeholder:"Faculty",grade_band:l.label,invited:l.count,responded:alloc[j]});
      for(let n=0;n<l.count;n++)facultyRoster.push({faculty_id:`FAC-${l.prefix}-${String(n+1).padStart(3,"0")}`,school_year:year,school_level:l.label,role:"Classroom teacher"});
      for(let n=0;n<alloc[j];n++)cohort[cursor++].grade_band=l.label;
    }
    if(cursor!==cohort.length)throw Error("Incomplete allocation");
  }
  out.survey_invitations=out.survey_invitations.filter(x=>x.stakeholder!=="Faculty").concat(revisedInv);
  out.faculty_roster=facultyRoster;
  out.metadata.school_levels=schoolLevels.map(({label,grades})=>({label,grades}));
  out.metadata.audiences=["Parent","Student","Faculty"];
  return out;
}
const output = enrichSchoolData(buildData());
mkdirSync("data",{recursive:true});
writeFileSync("data/synthetic.json",JSON.stringify(output,null,2)+"\n");
console.log("Wrote data/synthetic.json using seed",output.metadata.seed);
