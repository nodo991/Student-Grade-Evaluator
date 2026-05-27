/**
 * JAVASCRIPT EXERCISE: Student Grade Evaluator
 * File: grades.js
 */

// ==========================================
// Part 1 — Grade Validator
// ==========================================

/**
 * 1.1 isValidScore(score)
 * * APPROACH ON HANDLING 0:
 * In JavaScript, the number 0 is falsy. If we simply check (!score), a valid score of 0 
 * would be incorrectly blocked as invalid. To handle this, we explicitly check if 
 * score is strictly equal to 0 (score === 0) first. If it is, we immediately return true. 
 * Any other genuinely falsy or non-numeric inputs (null, undefined, "", NaN) are then 
 * filtered out with a warning message.
 */
function isValidScore(score) {
    if (score === 0) {
        return true;
    }
    
    if (!score || isNaN(score)) {
        console.warn("Warning: no score provided.");
        return false;
    }
    
    const numericScore = Number(score);
    return numericScore >= 0 && numericScore <= 100;
}

/**
 * 1.2 getLetterGrade(score, passingScore = 50)
 */
function getLetterGrade(score, passingScore = 50) {
    if (!isValidScore(score)) {
        return "Invalid";
    }

    const numScore = Number(score);

    if (numScore >= 90 && numScore <= 100) {
        return "A";
    } else if (numScore >= 75 && numScore <= 89) {
        return "B";
    } else if (numScore >= 60 && numScore <= 74) {
        return "C";
    } else if (numScore >= passingScore && numScore <= 59) {
        return "D";
    } else {
        return "F";
    }
}

/**
 * 1.3 The == vs === trap
 * * const formScore = "85";
 * console.log(formScore == 85);  // Output: true  -> Because == checks for value equality only and performs implicit type coercion.
 * console.log(formScore === 85); // Output: false -> Because === checks both value and strict data type (string is not equal to number).
 * console.log(isValidScore(formScore)); 
 * * EXPLANATION:
 * We should always use the strict equality operator (===) in isValidScore to avoid unpredictable 
 * type conversions. To make sure string numbers like "85" coming from forms are handled correctly, 
 * we safely convert the input using Number(score) before performing the boundary checks.
 */


// ==========================================
// Part 2 — Score Calculators
// ==========================================

/**
 * 2.1 calculateAverage
 * * WHY NOT ALWAYS DIVIDE BY 4?
 * If we only pass 3 scores, the fourth parameter (s4) defaults to 0. Always dividing by 4 
 * would mathematically drag down the actual average of those 3 exams. The 'count' parameter 
 * dynamically specifies how many actual exams are being averaged, solving this issue perfectly.
 */
const calculateAverage = (s1, s2, s3, s4 = 0, count = 3) => {
    const total = s1 + s2 + s3 + s4;
    return (total / count).toFixed(2);
};

// 2.2 calculateWeightedScore
const calculateWeightedScore = (exam, homework, bonus = 0) => {
    const weighted = (exam * 0.6) + (homework * 0.4) + bonus;
    return Number(weighted.toFixed(2));
};

// 2.3 isEligibleForRetake
const isEligibleForRetake = (score, attendance) => score < 60 && attendance >= 75;


// ==========================================
// Part 3 — Score Processor
// ==========================================

// 3.1 processScore (Function Expression)
const processScore = function(score, callback) {
    if (!isValidScore(score)) {
        console.error("Error: invalid score.");
        return null;
    }
    return callback(score);
};

// 3.2 applyToAll (Function Declaration)
function applyToAll(s1, s2, s3, callback) {
    const scores = [s1, s2, s3];
    for (let i = 0; i < scores.length; i++) {
        const result = processScore(scores[i], callback);
        if (result !== null) {
            console.log(`Score ${scores[i]}: ${result}`);
        }
    }
}


// ==========================================
// Part 4 — Score Tracker
// ==========================================

/**
 * WHAT IS A CLOSURE & WHY DOES THE STATE SURVIVE?
 * A closure is a combination of a function bundled together with references to its surrounding 
 * lexical environment. Even after createTracker() finishes executing, its local variables 
 * (count, total, highest, lowest) normally would be garbage collected. However, because the 
 * returned anonymous function still references them, JavaScript keeps them alive in memory. 
 * This creates a private state that cannot be accessed or modified from the outside.
 */
function createTracker(subjectName, passingScore = 60) {
    let count = 0;
    let total = 0;
    let highest = 0;
    let lowest = 100;

    return function(score) {
        if (!isValidScore(score)) {
            console.log(`[${subjectName}] Error: invalid score, not recorded.`);
            return;
        }

        const numScore = Number(score);
        count++;
        total += numScore;
        
        if (numScore > highest) highest = numScore;
        if (numScore < lowest) lowest = numScore;

        const avg = (total / count).toFixed(2);
        const status = numScore >= passingScore ? "Pass" : "Fail";

        console.log(`[${subjectName}] ${status} #${count} score: ${numScore} avg: ${avg} high: ${highest} low: ${lowest} -> ${status}`);
    };
}


// ==========================================
// Bonus — The Final Report
// ==========================================

function printStudentReport(name, exam, homework, attendance, bonus) {
    const finalScore = calculateWeightedScore(exam, homework, bonus);
    const grade = getLetterGrade(finalScore);
    const retake = isEligibleForRetake(finalScore, attendance) ? "Yes" : "No";

    const report = `====================================
Student:    ${name}
------------------------------------
Exam:       ${exam} (weight: 60%)
Homework:   ${homework} (weight: 40%)
Bonus:      ${bonus} pts

Final score: ${finalScore.toFixed(2)}
Grade:       ${grade}
Attendance:  ${attendance}%
Retake:      ${retake}
====================================`;

    console.log(report);
}


// ==========================================
// MANDATORY TEST CASES
// ==========================================

console.log("--- TEST PART 1: Grade Validator ---");
console.log("Valid score (85):", isValidScore(85));       
console.log("Valid boundary (0):", isValidScore(0));       
console.log("Invalid score (105):", isValidScore(105));   
console.log("Falsy input (null):", isValidScore(null));   

console.log("Letter Grade (92):", getLetterGrade(92));                 
console.log("Letter Grade (58, default):", getLetterGrade(58));        
console.log("Letter Grade (58, custom 60):", getLetterGrade(58, 60));  
console.log("Letter Grade (Invalid):", getLetterGrade(-10));           

console.log("\n--- TEST PART 2: Score Calculators ---");
console.log("Average (3 scores):", calculateAverage(70, 80, 90));                     
console.log("Average (4 scores):", calculateAverage(70, 80, 90, 100, 4));            
console.log("Weighted Score (80, 90, 5):", calculateWeightedScore(80, 90, 5));        
console.log("Retake Eligible (45, 80):", isEligibleForRetake(45, 80));                
console.log("Retake Eligible (75, 80):", isEligibleForRetake(75, 80));                

console.log("\n--- TEST PART 3: Score Processor (HOF) ---");
console.log("Process with Grade Callback:", processScore(78, getLetterGrade)); 
console.log("Process with Pass/Fail:", processScore(55, score => score >= 60 ? "Pass" : "Fail")); 

console.log("ApplyToAll (Letter Grades):");
applyToAll(55, 72, 91, getLetterGrade);
console.log("ApplyToAll (Pass/Fail):");
applyToAll(55, 72, 91, score => score >= 60 ? "Pass" : "Fail");

console.log("\n--- TEST PART 4: Score Tracker (Independent Closures) ---");
// Creating two separate trackers to demonstrate completely independent closure states
const mathTracker = createTracker("Mathematics");
mathTracker(78);
mathTracker(45);
mathTracker(92);
mathTracker(110); // Invalid edge case test

const englishTracker = createTracker("English", 55);
englishTracker(60);
englishTracker(50);

console.log("\n--- TEST BONUS: Final Report ---");
// Test 1: Happy path with the exact example provided in the assignment description
printStudentReport("Petra Novak", 74, 88, 82, 3);

// Test 2: Edge Case path using the same name to satisfy the multi-test requirement without adding extra names
printStudentReport("Tomas Novak", 40, 50, 80, 0);