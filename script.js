document.getElementById('loadBtn').addEventListener('click', loadEmployeeData);

async function loadEmployeeData() {
  const tbody = document.getElementById('tableBody');

  try {
    const response = await fetch('./employees.xml');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Could not find employees.xml`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML Syntax Error: ' + parseError.textContent);
    }

    const employees = xmlDoc.getElementsByTagName('employee');
    if (employees.length === 0) {
      throw new Error('No <employee> tags found in employees.xml');
    }

    tbody.innerHTML = '';

    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      const id = emp.getAttribute('id') || emp.getElementsByTagName('id')[0]?.textContent || '';
      const name = emp.getElementsByTagName('name')[0]?.textContent || '';
      const department = emp.getElementsByTagName('department')[0]?.textContent || '';
      const designation = emp.getElementsByTagName('designation')[0]?.textContent || '';
      const salaryRaw = emp.getElementsByTagName('salary')[0]?.textContent || '0';
      const salaryFormatted = '₹' + Number(salaryRaw).toLocaleString('en-IN');

      const row = `
        <tr>
          <td>${id}</td>
          <td>${name}</td>
          <td>${department}</td>
          <td>${designation}</td>
          <td>${salaryFormatted}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    }
  } catch (error) {
    console.error('XML Load Error:', error);
    alert('Unable to read XML file!\n\nDetails: ' + error.message);
  }
}