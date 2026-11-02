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
console.log("PASS data integrity",counts);
