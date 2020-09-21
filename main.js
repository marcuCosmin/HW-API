'use strict';

$(function() {

    window.checkboxCounter = 0;

    window.editGamesList = 0;

    window.disable = 0;

    window.mainUrl = 'https://games-app-siit.herokuapp.com/games';

    displayContent();
});

function displayContent(titl, imageUrl, descr) {

    if (disable === 0) {

        
        fetch(mainUrl, {
            
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
                    
                $('[data-sub-container]').append('<div class="' + displayContentResConv[index]._id + '"> <input type="button" onclick="deleteGame(this.id)" value="Remove" class="btn-remove-game" id="' + displayContentResConv[index]._id + '"> <h1>' + displayContentResConv[index].title + '</h1> <img src="' + displayContentResConv[index].imageUrl + '" alt=""> <p>' + displayContentResConv[index].description + '</p> </div>');

                if (editGamesList === 0) {

                    $('[data-select]').append('<option data-id=' + displayContentResConv[index]._id + ' value="' + displayContentResConv[index]._id + '">' + displayContentResConv[index].title + '</option>');
                }
                
                if (index === displayContentResConv.length - 1) {
                    
                    window.lastIndex = index + 1;
                }
            }

            editGamesList = 1;
            
            disable += 1;
        });
        
    } else {
        console.log(mainArr);
        
        $('[data-select]').append('<option data-id=' + mainArr[lastIndex]._id +' value="' + mainArr[lastIndex]._id + '">' + mainArr[lastIndex].title + '</option>');
       
        $('[data-sub-container]').append('<div class="' + mainArr[lastIndex]._id + '"> <input type="button" onclick="deleteGame(this.id)" value="Remove" class="btn-remove-game" id="' + mainArr[lastIndex]._id + '"> <h1>' + titl + '</h1> <img src="' + imageUrl + '" alt=""> <p>' + descr + '</p> </div>');

        lastIndex = lastIndex + 1;
    }
}

function addGame() {

    let title = $('[data-add-title]').val();
    let imgSrc = $('[data-add-image]').val();
    let description = $('[data-add-description]').val();

    fetch(mainUrl, {
        
        method: 'POST',
        
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({
            title: title,
            imageUrl: imgSrc,
            description: description,
        })
        
    }).then(() => {
        
        fetch(mainUrl, {
            
            method: 'GET'
            
        }).then((displayContentResUnc) => {
            
            if (displayContentResUnc.ok) {
                
                return displayContentResUnc.json();
            }
            
            throw new Error('Network response was not ok! (displayContent)')
            
        }).then((displayContentResConv) => {
            
            return displayContentResConv;
            
        }).then((displayContentResConv) => {
            
            mainArr = displayContentResConv;
            displayContent(title, imgSrc, description);
            alert('Game added!');
        });
    });

}

function disableInputs(seeIfChecked, dataArg) {

    if (seeIfChecked === true) {

        dataArg.prop('disabled', false);
        checkboxCounter += 1;
        
    } else {
        
        dataArg.prop('disabled', true);
        checkboxCounter -= 1;

    }
}

function editGame() {

    const selectedGameId = $('[data-select]').val();

    const checkTitle = $('[data-checkbox-title');
    const checkUrl = $('[data-checkbox-url');
    const checkDescr = $('[data-checkbox-descr');
    
    const editTitle = $('[data-edit-title').val();
    const editDescr = $('[data-edit-description').val();
    const editUrl = $('[data-edit-url').val();

    let editDetails = {
        title: editTitle,
        description: editDescr,
        imageUrl: editUrl,
        _id: selectedGameId
    };

    if (checkTitle.prop('checked') === false) {

        delete editDetails['title'];
    }
    if (checkDescr.prop('checked') === false) {

        delete editDetails['description'];
    }
    if (checkUrl.prop('checked') === false) {

        delete editDetails['imageUrl'];
    }

    if (checkboxCounter !== -3) {

        console.log(selectedGameId);

        fetch(mainUrl + '/' + selectedGameId, {

            method: 'PATCH',

            headers: {

                'Content-Type': 'application/json'
            },

            body: JSON.stringify(editDetails)

        }).then(() => {

            fetch(mainUrl + '/' + selectedGameId, {
                method: 'GET'
            }).then((editResp) => {
                return editResp.json();
            }).then((editRespConv) => {
                console.log(editRespConv);
            })

           console.log($(`.${selectedGameId}`).children());

        }).catch(() => {
            throw new Error('Edit failed! Netowrk response problem!');
        });

    } else {

        alert('Could not edit the game, all of the fields are disabled!');
    }

}

function deleteGame(clickedId) {
    
    fetch('https://games-app-siit.herokuapp.com/games/' + clickedId, {
        
        method: 'DELETE'
        
    }).then(() => {
        
        $('.sub-container').empty();
        
        $(`[data-id=${clickedId}]`).remove();
    
        disable = 0;
    
        mainArr.length -= 1;
    
        lastIndex -= 1;
    
        displayContent();
    })

}