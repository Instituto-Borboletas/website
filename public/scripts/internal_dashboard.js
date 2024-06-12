const PAGES = {
    'helps': renderHelps,
    'donations': renderDonations,
    'volunteers': renderVolunteers,
    'external_users': renderExternalUsers,
    'internal_users': renderInternalUsers
}

/**
    * @params {HtmlElement} element
*/
function renderLoading(element) {
    element.innerHTML = `
        <div class="spinner" role="status"></div>
        <div class="loading-text">Carregando dados...</div>
    `
}

async function renderHelps() {
}

async function renderDonations() {
}

async function renderVolunteers() {
}

async function renderExternalUsers() {
}

/**
    * @params {HtmlElement} element
*/
async function renderInternalUsers(element) {
    try {
        const internalUsers = await fetch('/interno/internos').then(response => response.text())
        element.innerHTML = internalUsers

        const modal = document.getElementById("user_modal");
        const closeButton = document.getElementsByClassName("close")[0];
        const button = document.getElementById("create_user");
        const userForm = document.getElementById("user_form");

        closeButton.addEventListener("click", function closeButtonClickHandler() {
            modal.style.display = "none";
        })
        button.addEventListener("click", function buttonClickHandler() {
            modal.style.display = "block";

            window.addEventListener("keydown", function escKeyHandlerOnModal(event) {
                if (event.key === "Escape") {
                    modal.style.display = "none";
                    window.removeEventListener("keydown", escKeyHandlerOnModal);
                }
            })
        })

        userForm.addEventListener("submit", async function submitHandler(event) {
            try {
                event.preventDefault()

                const response = await fetch('/users/internal', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: userForm.name.value,
                        email: userForm.email.value,
                        password: userForm.password.value,
                        // TODO: role: userForm.role.value,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    modal.style.display = "none";
                    renderInternalUsers(element)
                } else {
                    throw new Error(response)
                }
            } catch (err) {
                console.error(err)
                alert('Erro ao criar usuário, tente novamente mais tarde.')
            }
        })
    } catch (error) {
        console.error(error)
        element.innerHTML = 'Erro ao carregar os dados, tente novamente mais tarde.'
    }
}

/**
    * @params {HtmlElement} element
*/
function init(contentElement) {
    for (const [page, renderFunction] of Object.entries(PAGES)) {
        const element = document.getElementById(page)
        element.addEventListener('click', function clickHandler() {
            renderLoading(contentElement)
            renderFunction(contentElement)


            const { parentElement } = element.parentElement
            const activeElement = parentElement.querySelector('.active')

            if (activeElement) {
                activeElement.classList.remove('active')
            }
            element.classList.add('active')
        })
    }
}

init(document.getElementById('content'))
