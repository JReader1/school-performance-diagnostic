# Data dictionary & methodology

All information is generated and fictional. Seed: `20261102`.

| Collection | Grain / key | Fields and interpretation |
|---|---|---|
| families | One fictional household / family_id | first_year |
| students | One fictional student / student_id | family_id foreign key, first_enrolled |
| enrollments | Student × school_year | grade K=0 to 12, grade_band (Elementary School K–5, Middle School 6–8, High School 9–12), returning_student, tuition_assessed_usd, aid_usd |
| admissions | One inquiry / inquiry_id | school_year, grade_applied, source, stage, student_id only when enrolled |
| faculty_roster | Synthetic faculty ID × school_year | faculty_id, school_year, school_level, role (classroom teacher) |\n| survey_invitations | year × stakeholder × grade_band | invited, responded |
| survey_responses | Anonymous response / response_id | year, stakeholder, division, three 1–5 items, overall experience 1–5, recommend_0_10 |
| academic_benchmarks | year × grade (3–10) | students_assessed, math_met_benchmark, reading_met_benchmark |

**Relationships:** family_id links households to students; student_id links students to enrollments; enrolled admissions link to a student. Surveys have **no link to a real or synthetic student's identity** and only join aggregated invitation counts by year/group/division. Academic benchmarks are aggregate counts.

**Definitions:** Enrollment = annual enrolled rows; mean pillar score = mean observed 1–5 responses; survey response rate = responded/invited; benchmark attainment = count meeting benchmark/students assessed; net assessed tuition = sum(tuition assessed − aid), *not* cash received, income or collected tuition.

Three years: 2023–24, 2024–25, 2025–26. The generator simulates promotions, graduation exits, attrition, admissions, optional household siblings, different survey response propensities, and varying benchmark proportions. It deliberately encodes associations that have no bearing on real schools. No estimates of causal effects, valid population uncertainty intervals, or longitudinal individual survey comparisons are claimed. The pillars are fictional.

## Faculty survey population

Faculty is a **separate instructional-personnel audience**, not a relabeling of all support staff. The fictional faculty roster contains year-level teacher positions for Elementary School (K–5), Middle School (6–8), and High School (9–12), with 38, 41, and 44 invited teachers respectively. A distinct anonymous faculty response cohort is generated for each level and year. The survey responses do not contain faculty IDs; the roster only establishes a synthetic invitation population. The faculty questionnaire uses the same example priority scales for display comparability, **not** a claim that these are equivalent validated instruments across stakeholder groups.

"All School" in the filter means the whole selected school year; the grade-level filter restricts other measures to the specified level where available. School-level names reflect common U.S. K–12 terminology. Students only receive surveys in grades 6–12 in this example; selecting Elementary School + Students correctly shows no responses, rather than fabricating them.
