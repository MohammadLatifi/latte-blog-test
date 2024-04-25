import Cookies from '../../node_modules/js-cookie/dist/js.cookie.min.mjs';
import Toastify from '../../node_modules/toastify-js/src/toastify-es.js';

window.onload = function() {
    buildBookmarkContent();

    

    let gridItems = document.querySelectorAll('.views-view-responsive-grid__item');
    console.log(gridItems);
    let itemsCookies = retrieveInfoFromCookies();
 
    let index = 0 ;
    gridItems.forEach(function(item) {
        const tipoArticolo = item.querySelector('.views-field-field-tipo-cont-art-stand .field-content').textContent.trim();
        const imageUrl = item.querySelector('.views-field-field-immagine-in-evidenza img').getAttribute('src');
        const title = item.querySelector('.views-field-title a').textContent.trim();
        const url = item.querySelector('.views-field-title a').getAttribute('href');
        const mainTag = item.querySelector('.views-field-field-cat-princ-articolo .field__item').textContent.trim();
        const description = item.querySelector('.views-field-field-introduzione p').textContent.trim();
        const tag = item.querySelector('.views-field-field-tag .field__item').textContent.trim();
        const identifier = url

        let existingCookie = itemsCookies.find(cookie => cookie.identifier === identifier);
    
        const elementData = {
            index:index,
            identifier: existingCookie ? existingCookie.identifier : identifier,
            tipoArticolo: existingCookie ? existingCookie.tipoArticolo : tipoArticolo,
            imageUrl: existingCookie ? existingCookie.imageUrl : imageUrl,
            title: existingCookie ? existingCookie.title : title,
            url: existingCookie ? existingCookie.url : url,
            mainTag: existingCookie ? existingCookie.mainTag : mainTag,
            description: existingCookie ? existingCookie.description : description,
            tag: existingCookie ? existingCookie.tag : tag,
            isLiked: existingCookie ? existingCookie.isLiked : false
        };

        if(!existingCookie){
            Cookies.set('latte_card_' + index, JSON.stringify(elementData));
            index+=1
        }

        const bookmarkButton = item.querySelector('.views-field-field-bookmark .fr-bookmark');
        

        if (elementData.isLiked === true) {
            bookmarkButton.classList.add('latte-bookmark-liked');
        } 

        

        bookmarkButton.addEventListener('click', function(event) {
            event.preventDefault();
            elementData.isLiked = !elementData.isLiked;
            const pathElement = event.target;
            const item = pathElement.closest('.views-view-responsive-grid__item');
            const url = item.querySelector('.views-field-title a').getAttribute('href');
            const itemsCookies = retrieveInfoFromCookies();
            let existingCookie = itemsCookies.find(cookie => cookie.identifier === url);
            var modals = document.getElementById("bookmarks-modals");
            modals.innerHTML = ` 
            <div id="bookmark-modal" class="latte-modal">
                <div class="modal-container">
                    <div class="modal-content">
                        <p id ="bookmark-modal-content"></p>
                        <div>
                            <button id="accept-btn">Accept</button>
                            <button id="close-btn">Close</button>
                        </div>
                    </div>
                </div>
          </div>`;

            let modal = modals.querySelector('.latte-modal')
            var modalContent = modals.querySelector("#bookmark-modal-content");
            var acceptBtn = modals.querySelector("#accept-btn");
            var closeBtn = modals.querySelector("#close-btn");
            modal.style.display = "flex";
      
           
            modalContent.innerHTML = elementData.isLiked === false ? 'Are you sure you want to remove card from Bookmarks?' : 'Are you sure you want to add card to Bookmarks?' ;
            closeBtn.addEventListener("click", function() {
                modal.style.display = "none";
            })
            
            
            
            acceptBtn.addEventListener("click", function() {
                if (elementData.isLiked === true) {
                        
                        modal.style.display = "none";
                        bookmarkButton.classList.add('latte-bookmark-liked');
                        existingCookie.isLiked = true;
                        Cookies.set('latte_card_' + existingCookie.index, JSON.stringify(elementData));
                        Toastify({
                            text: "added to Bookmarks Cookies!",
                            duration: 2000,
                            newWindow: true,
                            close: true,
                            gravity: "top", 
                            position: "right", 
                            stopOnFocus: true, 
                            style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        
                        }).showToast();
                
                    }else {
              
                    
                        modal.style.display = "none";
                        bookmarkButton.classList.remove('latte-bookmark-liked');
                        existingCookie.isLiked = false;
                        Cookies.set('latte_card_' + existingCookie.index, JSON.stringify(elementData));
                        Toastify({
                            text: "removed from Bookmarks Cookies!",
                            duration: 2000,
                            newWindow: true,
                            close: true,
                            gravity: "top", 
                            position: "right", 
                            stopOnFocus: true, 
                            style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        
                        }).showToast();
                    };

                   
                });


        
        });


    });

};

function retrieveInfoFromCookies() {
    const retrievedData = [];
    const cookies = Object.keys(Cookies.get());

    cookies.forEach(cookieName => {
        if (cookieName.startsWith('latte_card_')) {
            const cookieData = Cookies.get(cookieName);
            if (cookieData) {
                retrievedData.push(JSON.parse(cookieData));
            }
        }
    });

    return retrievedData;
}


function buildBookmarkContent(){
    let itemsCookies = retrieveInfoFromCookies();
    let mainDiv = document.getElementById('latte-bookmark-main');
    if(mainDiv){
        mainDiv.innerHTML = '';
        console.log('mainDiv',mainDiv)
        itemsCookies.forEach(function(item) {
            if(item.isLiked){
                let cardHTML = `
                <div class="views-view-responsive-grid__item">
                <div class="views-view-responsive-grid__item-inner">
                    <div class="views-field views-field-field-tipo-cont-art-stand">
                        <div class="field-content text-small">${item.tipoArticolo}</div>
                    </div>
                    <div class="views-field views-field-field-immagine-in-evidenza">
                        <div class="field-content">
                            <article class="media media--type-image media--view-mode-default">
                                <div class="field field--name-field-media-image field--type-image field--label-visually_hidden">
                                    <div class="field__label visually-hidden">Immagine</div>
                                    <div class="field__item">
                                        <img
                                            loading="lazy"
                                            src="${item.imageUrl}"
                                            width="1920"
                                            height="1252"
                                            alt="${item.title}"
                                            class="img-fluid"
                                        />
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                    <div class="views-field views-field-field-cat-princ-articolo">
                        <div class="field-content test">
                            <div class="scienza_tecnologia taxonomy-term vocabulary-categorie" id="taxonomy-term-14">
                                <h2><a href="/scienza-e-tecnologia">
                                    <div class="field field--name-name field--type-string field--label-hidden field__item">
                                        ${item.mainTag}
                                    </div>
                                </a></h2>
                                <div class="content"></div>
                            </div>
                        </div>
                    </div>
                    <div class="views-field views-field-field-bookmark">
                        <div class="field-content">
                            <a class="fr-bookmark js-toggle-bookmark" data-target="${item.articleId}" href="#">
                                <svg class="svg-inline--fa fa-bookmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg="">
                                    <path fill="currentColor" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="views-field views-field-title">
                        <span class="field-content">
                            <div class="title_container">
                                <div class="views-field views-field-title">
                                    <a href="${item.url}" hreflang="it">${item.title}</a>
                                </div>
                            </div>
                        </span>
                    </div>
                    <div class="views-field views-field-field-introduzione">
                        <div class="field-content">
                            <p>${item.description}</p>
                        </div>
                    </div>
                    <div class="views-field views-field-field-tag">
                        <div class="field-content">
                            <div class="territorio taxonomy-term vocabulary-tag" id="taxonomy-term-64">
                                <h2><a href="/taxonomy/term/64">
                                    <div class="field field--name-name field--type-string field--label-hidden field__item">
                                        ${item.tag}
                                    </div>
                                </a></h2>
                                <div class="content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
                
                mainDiv.innerHTML += cardHTML;
            }
        });
    }
}