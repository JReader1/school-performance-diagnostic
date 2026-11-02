# Data dictionary & methodology

All information is generated and fictional. Seed: `20261102`.

| Collection | Grain / key | Fields and interpretation |
|---|---|---|
| families | One fictional household / family_id | first_year |
| students | One fictional student / student_id | family_id foreign key, first_enrolled |
| enrollments | Student × school_year | grade K=0 to 12, grade_band, returning_student, tuition_assessed_usd, aid_usd |
| admissions | One inquiry / inquiry_id | school_year, grade_applied, source, stage, student_id only when enrolled |
| survey_invitations | year × stakeholder × grade_band | invited, responded |
| survey_responses | Anonymous response / response_id | year, stakeholder, division, three 1–5 items, overall experience 1–5, recommend_0_10 |
| academic_benchmarks | year × grade (3–10) | students_assessed, math_met_benchmark, reading_met_benchmark |

**Relationships:** family_id links households to students; student_id links students to enrollments; enrolled admissions link to a student. Surveys have **no link to a real or synthetic student's identity** and only join aggregated invitation counts by year/group/division. Academic benchmarks are aggregate counts.

**Definitions:** Enrollment = annual enrolled rows; mean pillar score = mean observed 1–5 responses; survey response rate = responded/invited; benchmark attainment = count meeting benchmark/students assessed; net assessed tuition = sum(tuition assessed − aid), *not* cash received, income or collected tuition.

Three years: 2023–24, 2024–25, 2025–26. The generator simulates promotions, graduation exits, attrition, admissions, optional household siblings, different survey response propensities, and varying benchmark proportions. It deliberately encodes associations that have no bearing on real schools. No estimates of causal effects, valid population uncertainty intervals, or longitudinal individual survey comparisons are claimed. The pillars are fictional.
