// Обработчик для выпадающих форм
document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', function () {
        const section = this.parentElement;
        section.classList.toggle('active');
    });
});

document.getElementById('searchButton').addEventListener('click', searchStudents);

document.getElementById('addButton').addEventListener('click', addStudent);

document.getElementById('deleteButton').addEventListener('click', deleteStudent);

document.getElementById('updateButton').addEventListener('click', updateStudent);

// метод поиска записей (GET)
async function searchStudents() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const major = document.getElementById('major').value;

    // Формируем URL с параметрами
    const params = new URLSearchParams();
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);
    if (age) params.append('age', age);
    if (phoneNumber) params.append('phoneNumber', phoneNumber);
    if (major) params.append('major', major);

    const apiUrl = `http://localhost:5204/api/Students?${params.toString()}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const students = await response.json();
        displayResults(students);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        document.getElementById('resultsContainer').innerHTML =
            `<div class="error">Ошибка при выполнении запроса: ${error.message}</div>`;
    }
}

function displayResults(students) {
    const resultsContainer = document.getElementById('resultsContainer');

    if (students.length === 0) {
        resultsContainer.innerHTML = '<p>Студенты не найдены</p>';
        return;
    }

    let html = '';
    students.forEach(student => {
        html += `
                    <div class="student-card">
                        <h3>${student.lastName} ${student.firstName}</h3>
                        <p><strong>ID:</strong> ${student.id}</p>
                        ${student.age ? `<p><strong>Возраст:</strong> ${student.age}</p>` : ''}
                        ${student.phoneNumber ? `<p><strong>Телефон:</strong> ${student.phoneNumber}</p>` : ''}
                        ${student.major ? `<p><strong>Специальность:</strong> ${student.major}</p>` : ''}
                    </div>
                `;
    });

    resultsContainer.innerHTML = html;
}

// метод добавления записей (POST)
async function addStudent() {
    const firstName = document.getElementById('addFirstName').value.trim();
    const lastName = document.getElementById('addLastName').value.trim();
    const age = parseInt(document.getElementById('addAge').value);
    const phoneNumber = document.getElementById('addPhoneNumber').value.trim();
    const major = document.getElementById('addMajor').value.trim();

    // Валидация
    if (!firstName || !lastName || isNaN(age) || !phoneNumber || !major) {
        document.getElementById('addResultMessage').innerHTML =
            '<div class="error">Все поля обязательны для заполнения</div>';
        return;
    }

    try {
        const response = await fetch('http://localhost:5204/api/Students/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                age: age,
                phoneNumber: phoneNumber,
                major: major
            })
        });

        const result = await response.json();  // Читаем ответ сервера

        if (!response.ok) {
            throw new Error(result.message || 'Ошибка сервера');
        }

        document.getElementById('addResultMessage').innerHTML =
            '<div class="success">Студент добавлен успешно!</div>';

        // очистка полей
        document.getElementById('addFirstName').value = '';
        document.getElementById('addLastName').value = '';
        document.getElementById('addAge').value = '';
        document.getElementById('addPhoneNumber').value = '';
        document.getElementById('addMajor').value = '';

    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('addResultMessage').innerHTML =
            `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

// метод удаления записей (DELETE)
async function deleteStudent() {
    const id = document.getElementById('deleteId').value;

    try {
        const response = await fetch(`http://localhost:5204/api/Students/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            document.getElementById('deleteResultMessage').innerHTML =
                `<div class="success">Запись с ID:${id} удалена успешно!</div>`;
            // очистка поля
            document.getElementById('deleteId').value = '';
        }
        if (!response.ok) {
            document.getElementById('deleteResultMessage').innerHTML =
                `<div class="warning">Запись с ID:${id} не найдена!</div>`;
        }

    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('deleteResultMessage').innerHTML =
            `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

// метод удаления записей (PUT)
async function updateStudent() {
    const id = document.getElementById('updateId').value;
    const firstName = document.getElementById('updateFirstName').value.trim();
    const lastName = document.getElementById('updateLastName').value.trim();
    const age = parseInt(document.getElementById('updateAge').value);
    const phoneNumber = document.getElementById('updatePhoneNumber').value.trim();
    const major = document.getElementById('updateMajor').value.trim();

    if (!firstName || !lastName || isNaN(age) || !phoneNumber || !major) {
        document.getElementById('updateResultMessage').innerHTML =
            '<div class="warning">Все поля обязательны для заполнения!</div>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5204/api/Students/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                age: age,
                phoneNumber: phoneNumber,
                major: major
            })
        });

        const result = await response.json();  // Читаем ответ сервера

        if (!response.ok) {
            throw new Error(result.message || 'Ошибка сервера');
        }

        document.getElementById('updateResultMessage').innerHTML =
            '<div class="success">Запись обновлена успешно!</div>';

        // очистка полей
        document.getElementById('addFirstName').value = '';
        document.getElementById('addLastName').value = '';
        document.getElementById('addAge').value = '';
        document.getElementById('addPhoneNumber').value = '';
        document.getElementById('addMajor').value = '';

    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('updateResultMessage').innerHTML =
            `<div class="error">Ошибка: ${error.message}</div>`;
    }

}