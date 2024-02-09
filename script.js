document.addEventListener('DOMContentLoaded', function() {
    const passwordLengthRange = document.getElementById('passwordLength');
    const passwordLengthValue = document.getElementById('passwordLengthValue');
    const copyButton = document.getElementById('copyButton');
    const passwordResultContainer = document.getElementById('passwordResultContainer');
    const successMessage = document.getElementById('successMessage');

    passwordLengthRange.addEventListener('input', function() {
        passwordLengthValue.textContent = passwordLengthRange.value;
    });

    copyButton.addEventListener('click', function() {
        copyToClipboard();
    });

    passwordResultContainer.style.display = 'none';
    successMessage.style.display = 'none';
    loadPasswordHistory();
});

function generatePassword() {
    const passwordLength = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    const password = generateRandomPassword(passwordLength, includeUppercase, includeNumbers, includeSymbols);

    const passwordResult = document.getElementById('passwordResult');
    passwordResult.innerHTML = password;
    
    const passwordResultContainer = document.getElementById('passwordResultContainer');
    passwordResultContainer.style.display = 'flex';

    addToHistory(password);
}

function generateRandomPassword(length, uppercase, numbers, symbols) {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberCharset = '0123456789';
    const symbolCharset = '!@#$%^&*()-=_+[]{}|;:,.<>?';

    let fullCharset = charset;

    if (uppercase) {
        fullCharset += uppercaseCharset;
    }

    if (numbers) {
        fullCharset += numberCharset;
    }

    if (symbols) {
        fullCharset += symbolCharset;
    }

    let password = '';
    const charsetLength = fullCharset.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        password += fullCharset.charAt(randomIndex);
    }

    return password;
}


function copyToClipboard() {
    const passwordResult = document.getElementById('passwordResult');
    const passwordText = passwordResult.innerText;
    const successMessage = document.getElementById('successMessage');

    if (passwordText) {
        const textArea = document.createElement('textarea');
        textArea.value = passwordText;

        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        successMessage.innerText = 'Password copied to clipboard!';
        successMessage.style.display = 'block';

        setTimeout(function() {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

const MAX_PASSWORDS_IN_DISPLAY = 10;

function addToHistory(password) {
    const passwordHistory = document.getElementById('passwordHistory');
    const li = document.createElement('li');
    li.innerHTML = '<span class="password"></span><span class="highlight">' + password + '</span> <br>';
    passwordHistory.insertBefore(li, passwordHistory.firstChild);

    loadPasswordHistory();
    
    saveToLocalStorage(password);
}

function loadPasswordHistory() {
    const passwordHistory = document.getElementById('passwordHistory');
    const savedPasswords = getFromLocalStorage();

    if (savedPasswords) {
        passwordHistory.innerHTML = '';

        const passwordsToDisplay = savedPasswords.slice(0, MAX_PASSWORDS_IN_DISPLAY);

        passwordsToDisplay.forEach((password, index) => {
            const li = document.createElement('li');
            li.innerHTML = '<span class="password"></span><span class="highlight">' + password + '</span> <br>';
            passwordHistory.appendChild(li);

            if (index !== passwordsToDisplay.length - 1) {
                li.style.marginBottom = '8px';
            }
        });

        if (savedPasswords.length > MAX_PASSWORDS_IN_DISPLAY) {
            const remainingCount = savedPasswords.length - MAX_PASSWORDS_IN_DISPLAY;
            const li = document.createElement('li');
            li.innerHTML = '<span class="password"></span><span class="highlight">+' + remainingCount + ' other passwords</span> <br>';
            passwordHistory.appendChild(li);
        }
    }
}




function saveToLocalStorage(password) {
    const savedPasswords = getFromLocalStorage() || [];
    savedPasswords.unshift(password);
    localStorage.setItem('passwords', JSON.stringify(savedPasswords));
}

function getFromLocalStorage() {
    const savedPasswords = localStorage.getItem('passwords');
    return savedPasswords ? JSON.parse(savedPasswords) : null;
}

function clearHistory() {
    const passwordHistory = document.getElementById('passwordHistory');
    passwordHistory.innerHTML = '';
    clearLocalStorage();
}

function clearLocalStorage() {
    localStorage.removeItem('passwords');
}


function downloadHistory() {
    const savedPasswords = getFromLocalStorage();

    if (savedPasswords && savedPasswords.length > 0) {
        const textContent = savedPasswords.join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password_history.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
