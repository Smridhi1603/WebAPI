document.getElementById("user-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const userDataDiv = document.getElementById("user-data");
    userDataDiv.innerHTML = "";

    fetch(config.githubBaseURL + username, {
        headers: {
            Authorization: `token ${config.githubToken}`
        }
    })
        .then(response => response.json())
        .then(user => {
            if (user.message === "Not Found") {
                userDataDiv.innerHTML = "<p>User not found!</p>";
                return;
            }

            const profileHTML = `
                <h2>${user.name || username} (<a href="https://github.com/${user.login}" target="_blank">@${user.login}</a>)</h2>
                <img src="${user.avatar_url}" alt="${user.login}">
                <p>Followers: ${user.followers} - Following: ${user.following}</p>
                <p>Repos: ${user.public_repos}</p>
                <h4>Repos List:</h4>
                <div id="repos"></div>
            `;
            userDataDiv.innerHTML = profileHTML;

            fetch(config.githubBaseURL + username + "/repos", {
                headers: {
                    Authorization: `token ${config.githubToken}`
                }
            })
                .then(response => response.json())
                .then(repos => {
                    const reposDiv = document.getElementById("repos");
                    reposDiv.innerHTML = ""; // 🧼 Prevent duplication

                    repos.forEach(repo => {
                        const a = document.createElement("a");
                        a.href = repo.html_url;
                        a.textContent = repo.name;
                        a.className = "repo-tag";
                        a.target = "_blank";
                        reposDiv.appendChild(a);
                    });
                });
        });
});
