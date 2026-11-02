import {readFileSync} from "node:fs";
import {strict as assert} from "node:assert";
const d=JSON.parse(readFileSync("data/synthetic.json","utf8"));
function unique(rows,k){assert.equal(new Set(rows.map(r=>r[k])).size,rows.length,`duplicate ${k}`)}
for(const [t,k] of [["students","student_id"],["families","family_id"],["admissions","inquiry_id"],["survey_responses","response_id"]])unique(d[t],k);
const studentIds=new Set(d.students.map(x=>x.student_id)),familyIds=new Set(d.families.map(x=>x.family_id));
for(const x of d.students)assert(familyIds.has(x.family_id));
let keys=new Set(),counts={};
for(const x of d.enrollments){assert(studentIds.has(x.student_id));let key=x.student_id+"-"+x.school_year;assert(!keys.has(key));keys.add(key);assert(x.grade>=0&&x.grade<=12);assert(x.aid_usd<=x.tuition_assessed_usd);counts[x.school_year]=(counts[x.school_year]||0)+1}
assert.deepEqual(d.metadata.years.map(y=>counts[y]),[392,407,423]);
const inv=new Map(d.survey_invitations.map(x=>[[x.school_year,x.stakeholder,x.grade_band].join("|"),x]));
let responses=new Map();
for(const x of d.survey_responses){let key=[x.school_year,x.stakeholder,x.grade_band].join("|");assert(inv.has(key));responses.set(key,(responses.get(key)||0)+1);for(let v of ["academic_growth","character_culture","family_partnership","overall_experience"])assert(x[v]>=1&&x[v]<=5)}
for(const [k,v] of inv)assert.equal(responses.get(k)||0,v.responded,`survey count mismatch: ${k}`);
for(const x of d.academic_benchmarks){assert(x.math_met_benchmark<=x.students_assessed);assert(x.reading_met_benchmark<=x.students_assessed)}

const validLevels=new Set(["Elementary School","Middle School","High School"]);
for(const col of ["enrollments","academic_benchmarks","survey_responses","survey_invitations"]){
  for(const x of d[col]) assert(validLevels.has(x.grade_band)||x.grade_band==="All",`Unknown school level in ${col}: ${x.grade_band}`);
}
const allowedAudiences=new Set(["Parent","Student","Faculty"]);
for(const x of d.survey_responses) assert(allowedAudiences.has(x.stakeholder));
for(const x of d.survey_invitations) assert(allowedAudiences.has(x.stakeholder));
assert.equal(d.survey_invitations.some(x=>x.stakeholder==="Staff"),false,"Legacy staff survey category remains");
const facultyRows=d.faculty_roster;
assert(Array.isArray(facultyRows)&&facultyRows.length>0,"Missing separate faculty roster");
const facultyPairs=new Set();
for(const f of facultyRows){
 assert(validLevels.has(f.school_level));
 assert(d.metadata.years.includes(f.school_year));
 const k=f.faculty_id+"|"+f.school_year;
 assert(!facultyPairs.has(k),"Duplicate faculty-year pair");
 facultyPairs.add(k);
}
for(const year of d.metadata.years){
 for(const level of validLevels){
  const count=facultyRows.filter(f=>f.school_year===year&&f.school_level===level).length;
  const invite=d.survey_invitations.find(i=>i.school_year===year&&i.stakeholder==="Faculty"&&i.grade_band===level);
  assert(invite,"Missing faculty invitation cohort");
  assert.equal(invite.invited,count,"Faculty roster/invitation population mismatch");
 }
}

console.log("PASS data integrity, US school levels, and dedicated faculty cohorts",counts);
