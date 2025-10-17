let tasks = [];
const tbody = document.getElementById("table_body");
let editIndex = null; // menyimpan index yang sedang diedit

// Fungsi render tabel
function renderTable(dataToRender = tasks) {
    tbody.innerHTML = ""; // bersihkan tabel

    // Jika array kosong, tampilkan "No Task Found"
    if (dataToRender.length === 0) {
        tbody.innerHTML = `
            <tr id="no_task">
                <td colspan="5" style="text-align:center;">No Task Found</td>
            </tr>
        `;
        return;
    }

    // Tampilkan data
    dataToRender.forEach((item, index) => {
        let tr = document.createElement("tr");

        // No
        let tdNo = document.createElement("td");
        tdNo.textContent = index + 1;
        tr.appendChild(tdNo);

        // Task
        let tdTask = document.createElement("td");
        tdTask.textContent = item.tugas;
        tr.appendChild(tdTask);

        // Due Date
        let tdTgl = document.createElement("td");
        tdTgl.textContent = item.tgl;
        tr.appendChild(tdTgl);

        // Status
        let tdStatus = document.createElement("td");
        tdStatus.textContent = item.status;
        tr.appendChild(tdStatus);

        // Actions
        let tdActions = document.createElement("td");

        // Tombol Edit
        let btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit";
        btnEdit.type = "button";
        btnEdit.addEventListener("click", function () {
            edit(index);
        });
        tdActions.appendChild(btnEdit);

        tdActions.appendChild(document.createTextNode(" "));

        // Tombol Delete
        let btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete";
        btnDelete.type = "button";
        btnDelete.addEventListener("click", function () {
            deleteTask(index);
        });
        tdActions.appendChild(btnDelete);

        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });
}

// Delete semua isi tabel
document.getElementById("deleteall").addEventListener("click", function () {
    const yakin = confirm("Apakah kamu yakin ingin menghapus semua tugas?");
    if (yakin) {
        tasks = [];     // kosongkan array
        renderTable();  // render ulang
    }
});

// Fungsi tambah data
document.getElementById("tambah").addEventListener("click", function () {
    let task = document.getElementById("list").value;
    let date = document.getElementById("tgl").value;

    if (task === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    tasks.push({
        tugas: task,
        tgl: date,
        status: "Belum Selesai",
        originalIndex: tasks.length // simpan urutan awal
    });

    document.getElementById("list").value = "";
    document.getElementById("tgl").value = "";

    applyFilter(); // langsung render sesuai filter aktif
});

//Menu Edit (MODAL)
function edit(index) {
    editIndex = index; // simpan index yang sedang diedit

    // Isi modal dengan data yang lama
    document.getElementById("editTask").value = tasks[index].tugas;
    document.getElementById("editDate").value = tasks[index].tgl;
    document.getElementById("editStatus").value = tasks[index].status;

    // Tampilkan modal
    document.getElementById("modal").style.display = "flex";
}

// Tombol Batal (tutup modal)
document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

// Tombol Simpan (update data)
document.getElementById("saveEdit").addEventListener("click", function () {
    const updatedTask = document.getElementById("editTask").value;
    const updatedDate = document.getElementById("editDate").value;
    const updatedStatus = document.getElementById("editStatus").value;

    if (updatedTask === "") {
        alert("Nama tugas tidak boleh kosong!");
        return;
    }

    tasks[editIndex].tugas = updatedTask;
    tasks[editIndex].tgl = updatedDate;
    tasks[editIndex].status = updatedStatus;

    document.getElementById("modal").style.display = "none";
    applyFilter();
});

//Menu Delete
function deleteTask(index) {
    const yakin = confirm("Apakah kamu yakin ingin menghapus tugas ini?");
    if (yakin) {
        tasks.splice(index, 1);
        applyFilter();
    }
}

// Fungsi Filter
document.getElementById("filter").addEventListener("change", applyFilter);

function applyFilter() {
    const selected = document.getElementById("filter").value;
    let sortedTasks = [...tasks]; // duplikat array agar tidak merusak asli

    switch (selected) {
        case "by_task":
            sortedTasks.sort((a, b) => a.tugas.localeCompare(b.tugas));
            break;

        case "by_date":
            sortedTasks.sort((a, b) => {
                if (!a.tgl) return 1;
                if (!b.tgl) return -1;
                return new Date(a.tgl) - new Date(b.tgl);
            });
            break;

        case "by_status":
            sortedTasks.sort((a, b) => a.status.localeCompare(b.status));
            break;
    }

    renderTable(sortedTasks);
}

// Pertama kali load halaman → tampilkan "No Task Found"
renderTable();
