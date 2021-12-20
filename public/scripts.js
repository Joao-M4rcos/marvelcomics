const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func] (input.value)
        }, 1)
    },
    cpf (value) {
        value = value.replace(/\D/d,"")

        if(value.length > 13) value = value.slice(0, -1)

        value = value.replace(/(\d{3})(\d)/, "$1.$2")

        value = value.replace(/(\d{3})(\d)/, "$1.$2")

        value = value.replace(/(\d{3})(\d)/, "$1$2")

        return value
    },
    cardNumber(value) {
        value = value.replace(/\D/d,"")

        if(value.length > 18) value = value.slice(0, -1)

        value = value.replace(/(\d{4})(\d)/, "$1-$2")

        value = value.replace(/(\d{4})(\d)/, "$1-$2")

        value = value.replace(/(\d{4})(\d)/, "$1-$2")

        value = value.replace(/(\d{4})(\d)/, "$1-$2")

        return value
    },
    validity(value) {
        value = value.replace(/\D/d,"")

        if(value.length > 4) value = value.slice(0, -1)

        value = value.replace(/(\d{2})(\d)/, "$1/$2")

        return value
    },
    birthDate(value) {
        value = value.replace(/\D/d,"")

        if(value.length > 8) value = value.slice(0, -1)

        value = value.replace(/(\d{2})(\d)/, "$1/$2")

        value = value.replace(/(\d{2})(\d)/, "$1/$2")

        value = value.replace(/(\d{3})(\d)/, "$1/$2")

        return value
    }
}

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

function paginate(selectedPage, totalPages) {

    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {

    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)
    
    let elements = ""
    
    for (let page of pages) {
        if(String(page).includes("...")){
            elements += `<span>${page}</span>`
        }else{
            if(filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>` 
            }else {
                elements += `<a href="?page=${page}">${page}</a>` 
            }      
        }      
    }

    pagination.innerHTML = elements
    
}

const pagination = document.querySelector(".pagination")

if(pagination) {
    createPagination(pagination)
}



