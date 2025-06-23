
const API_URL = '/api/capsules';

// Fetch and display all capsules
async function fetchCapsules() {
    try {
        const response = await fetch(API_URL);
        const capsules = await response.json();
        const container = document.getElementById('capsulesContainer');
        container.innerHTML = '';

        if (capsules.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No capsules found.</p>';
            return;
        }

        capsules.forEach(capsule => {
            const card = document.createElement('div');
            card.className = 'capsule-card bg-white p-4 rounded-lg shadow-md flex justify-between items-center';
            card.innerHTML = `
                <div>
                    <h3 class="text-lg font-medium text-gray-800">${capsule.title}</h3>
                    <p class="text-sm text-gray-500">Open on: ${new Date(capsule.dateToOpen).toLocaleDateString()}</p>
                </div>
                <div class="space-x-2">
                    <button onclick="viewCapsule(${capsule.id})" class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">View</button>
                    <button onclick="deleteCapsule(${capsule.id})" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching capsules:', error);
        alert('Failed to load capsules.');
    }
}

// Create a new capsule
async function createCapsule() {
    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;
    const dateToOpen = document.getElementById('dateToOpen').value;

    if (!title || !contents || !dateToOpen) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, contents, dateToOpen })
        });

        if (response.ok) {
            document.getElementById('title').value = '';
            document.getElementById('contents').value = '';
            document.getElementById('dateToOpen').value = '';
            fetchCapsules();
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Error creating capsule:', error);
        alert('Failed to create capsule.');
    }
}

// View a capsule by ID
async function viewCapsule(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const capsule = await response.json();
            alert(`Title: ${capsule.title}\nContents: ${capsule.contents}\nOpen Date: ${new Date(capsule.dateToOpen).toLocaleDateString()}`);
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Error viewing capsule:', error);
        alert('Failed to view capsule.');
    }
}

// Delete a capsule by ID
async function deleteCapsule(id) {
    if (!confirm('Are you sure you want to delete this capsule?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchCapsules();
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Error deleting capsule:', error);
        alert('Failed to delete capsule.');
    }
}

// Initial fetch of capsules
fetchCapsules();