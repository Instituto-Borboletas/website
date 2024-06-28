function editHelpKind(kind) {
    const modal = document.getElementById("helps-kind-modal")
    const title = document.getElementById("kind-modal-title");
    const form = document.getElementById("helps-kind-modal");
    const currentTitle = title.innerText;
    const nameInput = document.querySelector("input[name='name']");
    const descriptionInput = document.querySelector("textarea[name='description']");
    const submitButton = document.querySelector("button[type='submit']");

    title.innerText = "Editar tipo de ajuda";
    nameInput.value = kind.name;
    descriptionInput.value = kind.description;
    submitButton.innerText = "Confirmar";

    modal.style.display = "block";

    window.addEventListener("keydown", function escKeyHandlerOnModal(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
            window.removeEventListener("keydown", escKeyHandlerOnModal);
        }
    })

    form.addEventListener("submit", async function submitHandler(event) {
        try {
            event.preventDefault()

            const response = await fetch(`/ajudas/tipos/editar`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: kind.id,
                    name: nameInput.value,
                    description: descriptionInput.value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                modal.style.display = "none";
                window.location.reload();
            } else {
                const responseJson = await response.json()
                throw new Error(responseJson.message)
            }
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message)
            } else {
                alert('Erro ao editar tipo de ajuda, tente novamente mais tarde.')
            }

            title.innerText = currentTitle;
        }
    })
}

function deleteHelpKind(kind) {
    const modal = document.getElementById("helps-kind-modal");
    const title = document.getElementById("kind-modal-title");
    const form = document.getElementById("helps-kind-modal");
    const currentTitle = title.innerText;
    const nameInput = document.querySelector("input[name='name']");
    const descriptionInput = document.querySelector("textarea[name='description']");
    const submitButton = document.querySelector("button[type='submit']");

    title.innerText = "Excluir tipo de ajuda";
    nameInput.value = kind.name;
    nameInput.disabled = true;
    descriptionInput.value = kind.description;
    descriptionInput.disabled = true;
    submitButton.innerText = "Confirmar";

    modal.style.display = "block";

    window.addEventListener("keydown", function escKeyHandlerOnModal(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
            window.removeEventListener("keydown", escKeyHandlerOnModal);
        }
    })

    form.addEventListener("submit", async function submitHandler(event) {
        try {
            event.preventDefault()

            const response = await fetch(`/ajudas/tipos/deletar/${kind.id}`, { method: 'DELETE' })

            if (response.ok) {
                modal.style.display = "none";
                window.location.reload();
            } else {
                const responseJson = await response.json()
                throw new Error(responseJson.message)
            }
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message)
            } else {
                alert('Erro ao excluir tipo de ajuda, tente novamente mais tarde.')
            }

            title.innerText = currentTitle;
        }
    })
}

function editVolunteerKind(kind) {
    const modal = document.getElementById("volunteers-kind-modal")
    const title = document.getElementById("volunteer-modal-title");
    const form = document.getElementById("new-kind-modal");
    const currentTitle = title.innerText;
    const nameInput = document.querySelector("input[name='name']");
    const descriptionInput = document.querySelector("textarea[name='description']");
    const submitButton = document.querySelector("button[type='submit']");

    title.innerText = "Editar tipo de voluntariado";
    nameInput.value = kind.name;
    descriptionInput.value = kind.description;
    submitButton.innerText = "Confirmar";

    modal.style.display = "block";

    window.addEventListener("keydown", function escKeyHandlerOnModal(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
            window.removeEventListener("keydown", escKeyHandlerOnModal);
        }
    })

    form.addEventListener("submit", async function submitHandler(event) {
        try {
            event.preventDefault()

            const response = await fetch(`/voluntarios/tipos/editar`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: kind.id,
                    name: nameInput.value,
                    description: descriptionInput.value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                modal.style.display = "none";
                window.location.reload();
            } else {
                const responseJson = await response.json()
                throw new Error(responseJson.message)
            }
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message)
            } else {
                alert('Erro ao editar tipo de ajuda, tente novamente mais tarde.')
            }

            title.innerText = currentTitle;
        }
    })
}

function deleteVolunteerKind(kind) {
    const modal = document.getElementById("volunteers-kind-modal")
    const title = document.getElementById("volunteer-modal-title");
    const form = document.getElementById("new-kind-modal");
    const currentTitle = title.innerText;
    const nameInput = document.querySelector("input[name='name']");
    const descriptionInput = document.querySelector("textarea[name='description']");
    const submitButton = document.querySelector("button[type='submit']");

    title.innerText = "Deletar tipo de voluntariado";
    nameInput.value = kind.name;
    descriptionInput.value = kind.description;
    submitButton.innerText = "Confirmar";

    modal.style.display = "block";

    window.addEventListener("keydown", function escKeyHandlerOnModal(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
            window.removeEventListener("keydown", escKeyHandlerOnModal);
        }
    })

    form.addEventListener("submit", async function submitHandler(event) {
        try {
            event.preventDefault()

            const response = await fetch(`/voluntarios/tipos/deletar/${kind.id}`, { method: 'DELETE' })

            if (response.ok) {
                modal.style.display = "none";
                window.location.reload();
            } else {
                const responseJson = await response.json()
                throw new Error(responseJson.message)
            }
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message)
            } else {
                alert('Erro ao excluir tipo de ajuda, tente novamente mais tarde.')
            }

            title.innerText = currentTitle;
        }
    })
}

/**
  * @param {HtmlElement} target
*/
function renderScript(target) {
    const scripts = target.getElementsByTagName("script");
    for (let script of scripts) {
        const newScript = document.createElement("script");
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        script.remove(); // Remove the old script to clean up the DOM
    }
}

const PAGES = {
    'ajudas': renderHelps,
    // 'doacoes': renderDonations,
    'voluntarios': renderVolunteers,
    // 'usuarios_externos': renderExternalUsers,
    'usuarios_internos': renderInternalUsers
}
let selectedPage = null;

/**
    * @params {HtmlElement} element
*/
function renderLoading(element) {
    element.innerHTML = `
        <div class="spinner" role="status"></div>
        <div class="loading-text">Carregando dados...</div>
    `
}

/**
    * @params {HtmlElement} target
*/
async function renderHelps(target) {
    try {
        const helps = await fetch('/ajudas').then(response => response.text())
        target.innerHTML = helps
        renderScript(target)
    } catch (err) {
        console.error(err)
        element.innerHTML = 'Erro ao carregar os dados, tente novamente mais tarde.'
    }
}

async function renderDonations() {

}

/**
    * @params {HtmlElement} target
*/
async function renderVolunteers(target) {
    try {
        const volunteers = await fetch('/voluntarios').then(response => response.text())
        target.innerHTML = volunteers
        renderScript(target)
    } catch (err) {
        console.error(err)
        element.innerHTML = 'Erro ao carregar os dados, tente novamente mais tarde.'
    }
}

/**
    * @params {HtmlElement} element
*/
async function renderInternalUsers(element) {
    try {
        const internalUsers = await fetch('/interno/usuarios/internos').then(response => response.text())
        element.innerHTML = internalUsers

        const modal = document.getElementById("user_modal");
        const closeButton = document.getElementsByClassName("close")[0];
        const button = document.getElementById("create_user");
        const userForm = document.getElementById("user_form");
        const emailInput = userForm.email;
        const submitButton = document.getElementById("submit_button")
        const messageWrapper = document.getElementById("message_wrapper");

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

        emailInput.addEventListener("input", function emailInputHandler() {
            if (submitButton.disabled) {
                submitButton.disabled = false
                messageWrapper.innerText = ''
            }
        })

        userForm.addEventListener("submit", async function submitHandler(event) {
            try {
                event.preventDefault()

                const response = await fetch('/usuarios/interno', {
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
                    const responseJson = await response.json()
                    throw new Error(responseJson.message)
                }
            } catch (err) {
                if (err instanceof Error) {
                    messageWrapper.innerText = err.message
                    submitButton.disabled = true
                } else {
                    alert('Erro ao criar usuário, tente novamente mais tarde.')
                }
            }
        })
    } catch (error) {
        console.error(error)
        element.innerHTML = 'Erro ao carregar os dados, tente novamente mais tarde.'
    }
}

async function renderExternalUsers() {
}

/**
    * @params {HtmlElement} element
*/
function init(contentElement) {
    for (const [page, renderFunction] of Object.entries(PAGES)) {
        const element = document.getElementById(page)
        element.addEventListener('click', function clickHandler() {
            if (selectedPage === page) {
                return
            }
            selectedPage = page
            const url = new URL(window.location.href)
            url.searchParams.set('menu', page)
            window.history.pushState({}, '', url)

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

    const params = new URLSearchParams(window.location.search)
    const page = params.get('menu')
    if (page && PAGES[page]) {
        document.getElementById(page).click()
    } else {
        const url = new URL(window.location.href)
        url.searchParams.delete('menu')
        window.history.pushState({}, '', url)
    }

}

init(document.getElementById('content'))
