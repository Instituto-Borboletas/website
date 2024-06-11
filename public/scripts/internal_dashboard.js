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
