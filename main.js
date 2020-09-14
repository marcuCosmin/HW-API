$(function() {

    window.disable = 0;

    displayContent();
});

function displayContent(titl, imageUrl, descr) {

    if (disable === 0) {

        
        fetch('https://games-app-siit.herokuapp.com/games', {
            
            method: 'GET'
            
        }).then((displayContentResUnc) => {
            
            if (displayContentResUnc.ok) {
                
                return displayContentResUnc.json();
            }
            
            throw new Error('Network response was not ok! (displayContent)')
            
        }).then((displayContentResConv) => {
            
            return displayContentResConv;
            
        }).then((displayContentResConv) => {
            
            window.mainArr = displayContentResConv;
            
            console.log(mainArr);
            
            for (let index = 0; index < displayContentResConv.length; index++) {
                    
                $('[data-sub-container]').append('<div class="div' + index + '"> <input type="button" onclick="deleteGame(this.id)" value="Remove" class="btn-remove-game" id="' + displayContentResConv[index]._id + '"> <h1>' + displayContentResConv[index].title + '</h1> <img src="' + displayContentResConv[index].imageUrl + '" alt=""> <p>' + displayContentResConv[index].description + '</p> </div>');

                if (index === displayContentResConv.length - 1) {

                    window.lastIndex = index + 1;
                }
            }
            
            window.disable += 1;
        });

    } else {
        console.log(mainArr);

        $('[data-sub-container]').append('<div class="div' + lastIndex + '"> <input type="button" onclick="deleteGame(this.id)" value="Remove" class="btn-remove-game" id="' + mainArr[lastIndex]._id + '"> <h1>' + titl + '</h1> <img src="' + imageUrl + '" alt=""> <p>' + descr + '</p> </div>');

        window.lastIndex = lastIndex + 1;
    }
}

function addGame() {
    
    let title = $('[data-add-title]').val();
    let imgSrc = $('[data-add-image]').val();
    let description = $('[data-add-description]').val();
    
    fetch('https://games-app-siit.herokuapp.com/games', {
        
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            title: title,
            imgUrl: imgSrc,
            description: description,

        })
    }).then((addRespUnc) => {

        return addRespUnc;
        
    }).then((addRespConv) => {

        mainArr[lastIndex] = addRespConv;
    });

    displayContent(title, imgSrc, description);
}


function deleteGame(clickedId) {

    fetch('https://games-app-siit.herokuapp.com/games/' + clickedId, {

        method: 'DELETE'

    });

    $(clickedId).parent('div').remove();
    
    disable = 0;
    
    displayContent();


    window.lastIndex -= 1;
} 