// Mock data for quiz questions - sẽ được thay thế bằng API QuestionBank sau này
export const quizQuestions = [
  {
    id: 1,
    question: "Trong lập trình C++, từ khóa nào được sử dụng để khai báo một biến không thể thay đổi giá trị?",
    type: "multiple_choice",
    options: [
      { id: "a", text: "const", isCorrect: true },
      { id: "b", text: "var", isCorrect: false },
      { id: "c", text: "let", isCorrect: false },
      { id: "d", text: "final", isCorrect: false }
    ],
    explanation: "Từ khóa 'const' trong C++ được sử dụng để khai báo một biến hằng số, không thể thay đổi giá trị sau khi khởi tạo.",
    difficulty: "easy",
    category: "C++ Basics",
    timeLimit: 30 // seconds
  },
  {
    id: 2,
    question: "Thuật toán nào sau đây có độ phức tạp thời gian O(n log n) trong trường hợp tốt nhất?",
    type: "multiple_choice",
    options: [
      { id: "a", text: "Bubble Sort", isCorrect: false },
      { id: "b", text: "Quick Sort", isCorrect: true },
      { id: "c", text: "Selection Sort", isCorrect: false },
      { id: "d", text: "Insertion Sort", isCorrect: false }
    ],
    explanation: "Quick Sort có độ phức tạp O(n log n) trong trường hợp tốt nhất và trung bình, O(n²) trong trường hợp xấu nhất.",
    difficulty: "medium",
    category: "Algorithms",
    timeLimit: 45
  },
  {
    id: 3,
    question: "Trong cấu trúc dữ liệu, cây nhị phân tìm kiếm (Binary Search Tree) có đặc điểm gì?",
    type: "multiple_choice",
    options: [
      { id: "a", text: "Mỗi node có tối đa 2 con", isCorrect: false },
      { id: "b", text: "Node con trái nhỏ hơn node cha, node con phải lớn hơn node cha", isCorrect: true },
      { id: "c", text: "Tất cả các node đều có cùng độ sâu", isCorrect: false },
      { id: "d", text: "Chỉ có thể có tối đa 2 mức", isCorrect: false }
    ],
    explanation: "BST có đặc điểm: node con trái < node cha < node con phải, giúp tìm kiếm hiệu quả với O(log n).",
    difficulty: "medium",
    category: "Data Structures",
    timeLimit: 40
  },
  {
    id: 4,
    question: "Trong JavaScript, phương thức nào được sử dụng để thêm một phần tử vào cuối mảng?",
    type: "multiple_choice",
    options: [
      { id: "a", text: "push()", isCorrect: true },
      { id: "b", text: "pop()", isCorrect: false },
      { id: "c", text: "shift()", isCorrect: false },
      { id: "d", text: "unshift()", isCorrect: false }
    ],
    explanation: "Phương thức push() thêm một hoặc nhiều phần tử vào cuối mảng và trả về độ dài mới của mảng.",
    difficulty: "easy",
    category: "JavaScript",
    timeLimit: 25
  },
  {
    id: 5,
    question: "Trong lập trình hướng đối tượng, tính chất nào cho phép một class kế thừa từ class khác?",
    type: "multiple_choice",
    options: [
      { id: "a", text: "Encapsulation", isCorrect: false },
      { id: "b", text: "Inheritance", isCorrect: true },
      { id: "c", text: "Polymorphism", isCorrect: false },
      { id: "d", text: "Abstraction", isCorrect: false }
    ],
    explanation: "Inheritance (Kế thừa) cho phép một class kế thừa các thuộc tính và phương thức từ class cha.",
    difficulty: "easy",
    category: "OOP Concepts",
    timeLimit: 30
  }
];

// Quiz configuration
export const quizConfig = {
  totalQuestions: quizQuestions.length,
  timePerQuestion: 30, // seconds
  allowSkip: true,
  showExplanation: true,
  shuffleQuestions: false,
  passingScore: 60 // percentage
};
