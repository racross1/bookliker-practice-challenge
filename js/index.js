document.addEventListener("DOMContentLoaded", function() {

//DATA
    fetchAllBooks()
    fetchMe()
    const ul = document.getElementById('list')
    const showPanelDiv = document.getElementById('show-panel')
    let isMe = {}
    
    function fetchAllBooks() {
        fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(books => books.forEach(book => renderBooks(book)))
    }    

    function fetchMe() {
        fetch('http://localhost:3000/users/1')
        .then(resp => resp.json())
        .then(user => isMe = user)
    }

    function patchBook(book) {
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        })
        .then(resp => resp.json())
        .then(book => loadBook(book))
    }


//DOM
    function renderBooks(book){
        let li = document.createElement('li')
        li.innerText = book.title
        li.id = book.id

        ul.appendChild(li)
        li.addEventListener('click', () => loadBook(book))

    }

    function loadBook(book) {
        showPanelDiv.innerHTML = ''

        let img = document.createElement('img')
        img.src = book.img_url

        let title = document.createElement('h2')
        title.innerText = book.title

        let subtitle = document.createElement('h3')
        subtitle.innerText = book.subtitle

        let author = document.createElement('h3')
        author.innerText = book.author

        //list users
        let userUl = document.createElement('ul')
        let users = book.users
        
        users.forEach(user => {
            let li = document.createElement('li')
            li.innerText = user.username
            userUl.appendChild(li)
        })
        
        //set like button text
        let likeBtn = document.createElement('button')
        if (book.users.find(user => user.id == isMe.id)){
            likeBtn.innerText = 'Unlike'
        } else {
            likeBtn.innerText = 'Like'
        }
        //add event listener
        likeBtn.addEventListener('click', () => handleClick(book))
        
        //append all children to page
        showPanelDiv.append(img, title, subtitle, author, userUl, likeBtn)
    }


//EVENT HANDLERS
    function handleClick(book) {
        found = book.users.find(user => user.id == isMe.id)
        if (!found) {
            book.users.push(isMe)
        } else {
            book.users.pop(isMe)
        }
        patchBook(book)
    }

})
