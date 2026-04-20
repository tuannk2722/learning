import { LessonContent } from "@/app/ui/courses/course-detail/lesson-detail/lesson-content";
import { LessonDetailHeader } from "@/app/ui/courses/course-detail/lesson-detail/lesson-header";
import { LessonNote } from "@/app/ui/courses/course-detail/lesson-detail/lesson-note";

// type LessonType = "video" | "docs" | "code";

export default async function LessonDetailPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await props.params;
  console.log("Course ID:", courseId, "Lesson ID:", lessonId);

  // Mock lesson data
  const lesson = {
    id: lessonId || "1",
    title: "Introduction to Variables and Data Types",
    courseTitle: "JavaScript Quest",
    lessonNumber: 4,
    totalLessons: 120,
    xp: 250,
    estimatedTime: 30,
    type: 'docs',
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Mock video URL
    content: `
# Variables and Data Types in JavaScript

Variables are containers for storing data values. In JavaScript, we can declare variables using \`var\`, \`let\`, or \`const\`.

## Declaring Variables

### Using let
\`\`\`javascript
let name = "John";
let age = 30;
let isStudent = true;
\`\`\`

### Using const
\`\`\`javascript
const PI = 3.14159;
const MAX_SIZE = 100;
\`\`\`

### Using var (old way, not recommended)
\`\`\`javascript
var oldVariable = "I'm old school";
\`\`\`

## Data Types

JavaScript has several fundamental data types:

### 1. Number
\`\`\`javascript
let integer = 42;
let float = 3.14;
let negative = -10;
\`\`\`

### 2. String
\`\`\`javascript
let singleQuotes = 'Hello';
let doubleQuotes = "World";
let templateLiteral = \`Hello \${name}\`;
\`\`\`

### 3. Boolean
\`\`\`javascript
let isTrue = true;
let isFalse = false;
\`\`\`

### 4. Undefined and Null
\`\`\`javascript
let notDefined;
let empty = null;
\`\`\`

### 5. Object
\`\`\`javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};
\`\`\`

### 6. Array
\`\`\`javascript
let fruits = ["Apple", "Banana", "Orange"];
let numbers = [1, 2, 3, 4, 5];
\`\`\`

## Type Checking

You can check the type of a variable using the \`typeof\` operator:

\`\`\`javascript
console.log(typeof 42);          // "number"
console.log(typeof "Hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (this is a known quirk)
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"
\`\`\`

## Best Practices

1. **Use \`const\` by default**: If you don't need to reassign a variable, use \`const\`
2. **Use \`let\` when needed**: Use \`let\` when you need to reassign a variable
3. **Avoid \`var\`**: The \`var\` keyword has confusing scoping rules
4. **Use descriptive names**: \`let userAge = 25\` is better than \`let x = 25\`
5. **Follow naming conventions**: Use camelCase for variables (\`myVariableName\`)

## Practice Exercise

Try creating variables for the following:
- Your name (string)
- Your age (number)
- Whether you're a student (boolean)
- A list of your hobbies (array)
- An object describing your favorite book

## Summary

- Variables store data values
- Use \`const\` for values that won't change
- Use \`let\` for values that will change
- JavaScript has multiple data types: number, string, boolean, object, array, null, and undefined
- Always use descriptive variable names
    `
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-24">
        {/* Lesson Header */}
        <LessonDetailHeader lesson={lesson} courseId={courseId} />

        {/* Lesson Content */}
        <LessonContent
          lesson={lesson}
          courseId={courseId}
          lessonId={lessonId}
        />

        {/* Lesson Note */}
        <LessonNote />
      </div>
    </div>
  );
}
