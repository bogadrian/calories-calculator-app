// Storage Controler
const StorCtrl = (function () {
   
  //public methodes
  return {
    //set storage
  setItemLS: function (item) {
    let items;
    //check ls
   if (localStorage.getItem('items') === null) {
     items = [];
     //push the new item in ls
     items.push(item);
     //set ls
     localStorage.setItem('items', JSON.stringify(items));
   }else {
     items = JSON.parse(localStorage.getItem('items'));
     //push the item to items array in ls
     items.push(item);
    //set ls
    localStorage.setItem('items', JSON.stringify(items));
   }
  },
  //get storage
  getItemFromLS: function () {
    let items; 
    if (localStorage.getItem('items') === null) {
      items = [];
    }else {
      items = JSON.parse(localStorage.getItem('items'))
    }
    return items;
  },
  //update storage
  updateItemFromLS: function (updatedItem) {
    
    let items = JSON.parse(localStorage.getItem('items'));

    items.forEach(function (itemStore, index) {
      if (updatedItem.id === itemStore.id) {
        items.splice(index, 1, updatedItem)
      }
    });
  //set back ls
  localStorage.setItem('items', JSON.stringify(items));
  },
  //delete storage
  deleteItemFromLS: function (itemDeleted) {
    let items = JSON.parse(localStorage.getItem('items'));

   items.forEach(function (ite, index) {
      if (itemDeleted.id === ite.id) {
        items.splice(index, 1)
      }
      });
    //set back ls
   localStorage.setItem('items', JSON.stringify(items));
    },
    // remove all items from ls
    removeAllItemsFromLS: function () {
     localStorage.removeItem('items');
  }
}  
})();


// Item Controler
const ItemCtrl = (function () {
  //item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //data structure
  data = {
    items: StorCtrl.getItemFromLS(),
    currItem: null,
    totalCalories: 0
  }
  
  //Public methodes
  return {
    //get data 
    getData: function () {
      return data;
    },
    //set current item once in edit state
    setCurrentItem: function (id) {
      let found = null;
     
      data.items.forEach(function (item) {  
        if (item.id === id) {
          data.currItem = item;
          found = item;
        }
      });
     return found;
    },
    //create item
    createItem: function (input) {
      //create an ID
      let ID;
      if (data.items.length > 0) {
        ID = parseInt(data.items[data.items.length - 1].id) + 1;
      }else {
        ID = 0;
      };
     
      //parse calories value tu number
      input.inputCalories = parseInt(input.inputCalories);

       //create a new Item with the Item Constructor
      const item = new Item(ID, input.inputName, input.inputCalories);

      //push the new item into data.items array
      data.items.push(item);
      
      return item;
    },
    //set total calories in data structure
    totalCaloriesFunct: function () {
      let calories = 0;
      data.items.forEach(function (item) { 
        //Parse int calories to get number and  able to add it to calories variable
        calories += parseInt(item.calories);
      });
    
      data.totalCalories = calories; 
      //return totalCalories
      return data.totalCalories; 
    },
    //update item
    updateItemData: function (input) {
       let found;
     data.items.forEach(function (item) {
      
        if (item.id === data.currItem.id) {
          item.name = input.inputName;
          item.calories = input.inputCalories;
          found = item;
        }
        
     });
    return found;
   },
   //delte item from data structure
   deleteItemFromDataStructure: function () {
     let itemToDelete;
    data.items.forEach(function (item, index) {
      if (item.id === data.currItem.id) {
        data.items.splice(index, 1);
        itemToDelete = item;
      } 
    });
    return itemToDelete;
   },
   // remove all items from data structure
   removeAll: function () {
     data.items = [];
   }
  }
})();





//Ui Controler 
const UICtrl = (function () {

  // DOM selectors
  const Selectors = {
    ItemList: '#item-list',
    addBtn: '.add-btn',
    deleteBtn: '.delete-btn',
    updateBtn: '.update-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    listItems: '#item-list',
    totalCalories: '.total-calories',
    allLi: '#item-list li'
  }
  //public methodes
  return {
    //print existing data to UI 
    printData: function (data) {
      let html = '';
      
      data.items.forEach(function (item) {
         html += `
         <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
         `;
      });

      document.querySelector(Selectors.ItemList).innerHTML = html;
    },
    //show item add a nea item to the UI added 
    showItem: function (id) {
     
      const items = ItemCtrl.getData();
      
      items.items.forEach(function (item) {
         
        if (item.id === id) {
         const li = document.createElement('li');
         li.className = 'collection-item';
         li.id = `item-${item.id}`;
         li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
         `;
        document.querySelector(Selectors.listItems).insertAdjacentElement('beforeend', li);

        }
      })
    },
    // display total calories updated each time
    showTotalCalories: function(totalCalories) {
      
      document.querySelector(Selectors.totalCalories).textContent = totalCalories;
    },
    // clear state hides the buttons
    clearState: function () {
      UICtrl.clearInput();
      document.querySelector(Selectors.updateBtn).style.display = 'none';
      document.querySelector(Selectors.deleteBtn).style.display = 'none';
      document.querySelector(Selectors.backBtn).style.display = 'none';
      document.querySelector(Selectors.addBtn).style.display = 'block';
    },
    //return DOM selectors to make them availble in App controler
    returnSelectors: function () {
      return Selectors;
    },
    // get input values
    getInputValues: function () {
      const inputName = document.querySelector(Selectors.itemName).value;
      const inputCalories = document.querySelector(Selectors.itemCalories).value;
      return {
        inputName,
        inputCalories
      }
    },
    // clear input one the input values were registred
    clearInput: function () {
      document.querySelector(Selectors.itemName).value = '';
      document.querySelector(Selectors.itemCalories).value = '';
    },
   // put the current item on edit state in UI
    editSubmitState: function (item) {
      document.querySelector(Selectors.itemName).value = item.name;
      document.querySelector(Selectors.itemCalories).value = item.calories;
    },
    //isplay edite state buttons after item was added to UI in edit mode
    displayEditState: function () {
      document.querySelector(Selectors.updateBtn).style.display = 'inline';
      document.querySelector(Selectors.deleteBtn).style.display = 'inline';
      document.querySelector(Selectors.backBtn).style.display = 'inline';
      document.querySelector(Selectors.addBtn).style.display = 'none';
    },
    //update item in current state
    updItem: function (item) {
     
      const listIt = document.querySelectorAll(Selectors.allLi);
      
       const list = Array.from(listIt);
       
       list.forEach(function (liItem) {
         const id = liItem.getAttribute('id');
          if (id === `item-${item.id}`) {
            liItem.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
            `;
          }
       });
       
    //clear state
    UICtrl.clearState();
    },
    //print the data (with item changed to Ui) and cleare state
    clearTheUi: function () {
      const data = ItemCtrl.getData();
      UICtrl.printData(data);
      UICtrl.clearState();

    //add total calories in data structure
    const totalCalories = ItemCtrl.totalCaloriesFunct();

    //print total Calories ti UI
    UICtrl.showTotalCalories(totalCalories);
    },
    //delete item from UI
    clearAllLi: function () {
      const listIt = document.querySelectorAll(Selectors.allLi);
      
       const list = Array.from(listIt);
       
       list.forEach(function (liItem) {
       liItem.remove();
    });

     //add total calories in data structure
     const totalCalories = ItemCtrl.totalCaloriesFunct();

     //print total Calories ti UI
     UICtrl.showTotalCalories(totalCalories);
  }
}

})();



//App controler
const App = (function (ItemCtrl, StorCtrl, UICtrl) {
  
  //event handler function (to be called in init App controler)
  const evenetHandeler = function () {
     
    //get Selectors 
    const Selectors = UICtrl.returnSelectors();
    //add item event
    document.querySelector(Selectors.addBtn).addEventListener('click', inputValues);
   //disable enter
    document.addEventListener('keypress', enterDisabled)
    //select the list item 
    document.querySelector(Selectors.ItemList).addEventListener('click', editItemId);
     // add event on back button press
    document.querySelector(Selectors.backBtn).addEventListener('click', goBackFunct);
     // add event on update button press
    document.querySelector(Selectors.updateBtn).addEventListener('click', updateItem);
     // add event on delete button press
    document.querySelector(Selectors.deleteBtn).addEventListener('click', deleteItem);
   // add event on clear button press
    document.querySelector(Selectors.clearBtn).addEventListener('click', clearAll)
  }
  // input values function which is called from add button press event
  const inputValues = function (e) {  
    e.preventDefault();
   //get input values
   const input = UICtrl.getInputValues();

   //check if input values are diffrent than empty
   if (input.inputName !== '' && input.inputCalories !== '') {
    //call a function in ItemCtrl to create the new item
   const item = ItemCtrl.createItem(input);

    //add total calories in data structure
    const totalCalories = ItemCtrl.totalCaloriesFunct();

    //print total Calories ti UI
    UICtrl.showTotalCalories(totalCalories);
  
    //set local storage with the new item
    StorCtrl.setItemLS(item);
   
   //clear input
   UICtrl.clearInput();

   //add item to the UI
   UICtrl.showItem(item.id);
   }else {
     alert('please add a food and its calories')
   }
    
  };
  //disable enter key function
  const enterDisabled = function (e) {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      return false;
    }
  }
  // edit item function on update button press
  const editItemId = function (e) {
    e.preventDefault();
   // control if the edit icon is pressed
     if (e.target.classList.contains('edit-item')) {
       //get the respective id from li
      const ids = e.target.parentNode.parentNode.id;
      // split the id tag
       const arrayId = ids.split('-');
       //get only the number from that tag (without item prefix)
       const id = parseInt(arrayId[1]);
      //call set current item function and passe it the id
       const itemFound = ItemCtrl.setCurrentItem(id);
      // call the edit submit to change the UI function and pass the item found to it
       UICtrl.editSubmitState(itemFound);
      // call the display edit state to show the buttons
       UICtrl.displayEditState();

     }
   
  };
  const updateItem = function (e) {
    //get the input values
    const input = UICtrl.getInputValues();
   
    //call a function in item ctrl to update data structure
    const itemUpdated = ItemCtrl.updateItemData(input);
    
    //update item in UI
    UICtrl.updItem(itemUpdated);

    //add total calories in data structure
    const totalCalories = ItemCtrl.totalCaloriesFunct();

    //print total Calories ti UI
    UICtrl.showTotalCalories(totalCalories);

    //update item in ls
    StorCtrl.updateItemFromLS(itemUpdated)

  };
  // delete item function
  const deleteItem = function (e) {
    //delete item from data structure
    const itemDeleted = ItemCtrl.deleteItemFromDataStructure();
    
    //delete item from ls
    StorCtrl.deleteItemFromLS(itemDeleted)
   
    //clear the Ui 
    UICtrl.clearTheUi();
  };
  //clear all function 
  const clearAll = function () {
    //clear the data structure
    ItemCtrl.removeAll();
    // clear teh UI
    UICtrl.clearAllLi();
    //clear ls
    StorCtrl.removeAllItemsFromLS();
  }
  // eneble go back button function
  const goBackFunct = function () {
    UICtrl.clearState();
  };

  //Public Methodes
  return {
  // init function to be called outside the controler and lunch the application
    init: function () {
      //get data 
      const getDataFromItemCtrl = ItemCtrl.getData();
    

      //add total calories in data structure
      const totalCalories = ItemCtrl.totalCaloriesFunct();

      //print total Calories ti UI
      UICtrl.showTotalCalories(totalCalories);

      //print data ti UI
      UICtrl.printData(getDataFromItemCtrl);

      //clear state
      UICtrl.clearState();

      //call eventHandeler function
      evenetHandeler();
     
    }
  }

})(ItemCtrl, StorCtrl, UICtrl);

//init the app
App.init();