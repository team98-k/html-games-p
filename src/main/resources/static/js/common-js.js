function getData() {
    const formObjs = document.querySelectorAll('input[id], select[id], textarea[id]');
    const data = {};
    for (const formObj of formObjs) {
        if (formObj.type === 'radio') {
            if (!data[formObj.name] && document.querySelector(`[name=${formObj.name}]:checked`)) {
                data[formObj.name] = document.querySelector(`[name=${formObj.name}]:checked`).value;
            }
        } else if (formObj.type === 'checkbox') {
            const checkObjs = document.querySelectorAll(`[name=${formObj.name}]:checked`);
            const values = [];
            for (const checkObj of checkObjs) {
                values.push(checkObj.value);
            }
            data[formObj.name] = values;
        } else if (formObj.type === 'select-multiple') {
            const selectedObjs = document.querySelectorAll(`[id=${formObj.id}] option:checked`);
            const values = [];
            for (const selectedObj of selectedObjs) {
                values.push(selectedObj.value);
            }
            data[formObj.id] = values;
        }
        else if (formObj.type === 'date') {
            // 하이픈 '-' 제거
            data[formObj.id] = formObj.value.replace(/-/g, '');
        }
        else {
            data[formObj.id] = formObj.value;
        }
    }
    return data;
}

function getJsonFromData() {
    return JSON.stringify(getData());
}