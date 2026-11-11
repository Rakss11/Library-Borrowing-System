let books = JSON.parse(localStorage.getItem("books")) || [
    {id:"B101",name:"Wings of Fire",author:"A.P.J. Abdul Kalam",borrowed:false},
    {id:"B102",name:"The Alchemist",author:"Paulo Coelho",borrowed:false},
    {id:"B103",name:"Ponniyin Selvan",author:"Kalki",borrowed:false}
];

let history = JSON.parse(localStorage.getItem("history")) || [];

function save() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("history", JSON.stringify(history));
}

function showPage(id) {
    document.querySelectorAll(".page").forEach(p =>
        p.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");
    update();
}

function update() {
    document.getElementById("total").innerText = books.length;
    document.getElementById("available").innerText =
        books.filter(b => !b.borrowed).length;
    document.getElementById("borrowed").innerText =
        books.filter(b => b.borrowed).length;

    document.getElementById("late").innerText = 0;

    document.getElementById("bookList").innerHTML =
        books.map(b => `
        <div class="book-item">
        <b>${b.name}</b> (${b.id})<br>
        Author: ${b.author}<br>
        Status: ${b.borrowed ? "Borrowed" : "Available"}
        </div>`).join("");

    let options = books.filter(b => !b.borrowed)
        .map(b => `<option value="${b.id}">${b.name}</option>`).join("");

    document.getElementById("borrowBook").innerHTML =
        options || '<option value="">No available books</option>';

    let borrowedOptions = books.filter(b => b.borrowed)
        .map(b => `<option value="${b.id}">${b.name}</option>`).join("");

    document.getElementById("returnBook").innerHTML =
        borrowedOptions || '<option value="">No borrowed books</option>';

    document.getElementById("historyList").innerHTML =
        history.map(h => `<div class="book-item">${h}</div>`).join("");

    document.getElementById("overdueList").innerText =
        "Overdue tracking will be added in the next update.";
}

function addBook() {
    let id = document.getElementById("bookId").value.trim();
    let name = document.getElementById("bookName").value.trim();
    let author = document.getElementById("author").value.trim();

    if (!id || !name || !author) {
        alert("Please fill all details!");
        return;
    }

    if (books.some(b => b.id === id)) {
        alert("Book ID already exists!");
        return;
    }

    books.push({id, name, author, borrowed:false});
    save();
    update();

    document.getElementById("bookId").value = "";
    document.getElementById("bookName").value = "";
    document.getElementById("author").value = "";

    alert("Book added successfully!");
}

function borrowBook() {
    let id = document.getElementById("borrowBook").value;
    let name = document.getElementById("student").value.trim();
    let sid = document.getElementById("studentId").value.trim();

    let book = books.find(b => b.id === id);

    if (!name || !sid || !book) {
        alert("Enter student details and select a book!");
        return;
    }

    book.borrowed = true;
    book.student = name;
    book.studentId = sid;
    book.borrowDate = new Date().toISOString().slice(0,10);

    let due = new Date();
    due.setDate(due.getDate() + 14);
    book.dueDate = due.toISOString().slice(0,10);

    save();
    update();
    alert("Book borrowed successfully!");
}

function returnBook() {
    let id = document.getElementById("returnBook").value;
    let book = books.find(b => b.id === id && b.borrowed);

    if (!book) {
        alert("Please select a borrowed book!");
        return;
    }

    history.unshift(book.name + " returned by " + book.student);
    book.borrowed = false;
    delete book.student;
    delete book.studentId;
    delete book.borrowDate;
    delete book.dueDate;

    save();
    update();
    alert("Book returned successfully!");
}

document.getElementById("search").addEventListener("input", function() {
    let q = this.value.toLowerCase();

    document.getElementById("bookList").innerHTML =
        books.filter(b =>
            b.name.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q)
        ).map(b => `
        <div class="book-item">
        <b>${b.name}</b> (${b.id})<br>
        Author: ${b.author}<br>
        Status: ${b.borrowed ? "Borrowed" : "Available"}
        </div>`).join("");
});

showPage("dashboard");
