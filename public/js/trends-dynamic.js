document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/blog')
        .then(res => res.json())
        .then(posts => {
            const listContainer = document.querySelector('#ozel-trendler ul');
            if (listContainer && posts.length > 0) {
                listContainer.innerHTML = '';
                posts.forEach((post, index) => {
                    listContainer.innerHTML += `
                        <li style="margin-bottom: 10px; color: #fff; font-size: 1.1rem; display: flex; align-items: center;">
                            <i class="fas fa-star" style="color: var(--accent-gold); margin-right: 15px; font-size: 0.8rem;"></i>
                            ${index + 1}. ${post.title}
                        </li>
                    `;
                });
            }
        })
        .catch(err => console.error('Error loading trends:', err));
});
