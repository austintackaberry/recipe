import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      addedRecipes: [{
        "Swedish Pancakes":["eggs","milk","flour","sugar"]
      }],
      nextRecipeName: "",
      nextRecipeIngr: [],
      editing: false
    }
    this.addRecipe = this.addRecipe.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.updateNextRecipeName = this.updateNextRecipeName.bind(this);
    this.updateNextRecipeIngr = this.updateNextRecipeIngr.bind(this);
  }

  componentWillUpdate() {
    localStorage.setItem('addedRecipes',JSON.stringify(this.state.addedRecipes));
  }

  componentWillMount() {
    if (localStorage.getItem("addedRecipes")) {
      this.setState({addedRecipes:JSON.parse(localStorage.getItem("addedRecipes"))});
    }
  }

  addRecipe() {
    this.ingrTextInput.value = "";
    this.nameTextInput.value = "";
    var addedRecipes = this.state.addedRecipes;
    var recipeName = this.state.nextRecipeName;
    if (this.state.editing) {
      this.setState({editing:false});
      for (let i = 0; i < addedRecipes.length; i++) {
        if (recipeName in addedRecipes[i]) {
          addedRecipes[i][recipeName] = this.state.nextRecipeIngr;
          break;
        }
      }
    }
    else {
      var obj = {};
      obj[recipeName] = this.state.nextRecipeIngr;
      addedRecipes.push(obj);
    }
    this.setState(
      {addedRecipes: addedRecipes}
    );
  }

  deleteRecipe(event) {
    var addedRecipes = this.state.addedRecipes;
    for (let i = 0; i < addedRecipes.length; i++) {
      if (event.target.value in addedRecipes[i]) {
        addedRecipes.splice(i,1);
        break;
      }
    }
    this.setState(
      {addedRecipes:addedRecipes}
    );
  }

  editRecipe(event) {
    this.setState({editing:true});
    var addedRecipes = this.state.addedRecipes;
    this.nameTextInput.value = event.target.value;
    this.setState({nextRecipeName:event.target.value});
    for (let i = 0; i < addedRecipes.length; i++) {
      if (event.target.value in addedRecipes[i]) {
        this.ingrTextInput.value = addedRecipes[i][event.target.value].join(", ");
        this.setState({nextRecipeIngr:addedRecipes[i][event.target.value]});
        break;
      }
    }
  }

  updateNextRecipeName(event) {
    this.setState(
      {nextRecipeName:event.target.value}
    );
  }

  updateNextRecipeIngr(event) {
    var ingredients = event.target.value;
    ingredients = ingredients.split(/, *|\n/);
    this.setState(
      {nextRecipeIngr:ingredients}
    );
  }

  render() {
    var finalJSX = [];
    var editingJSX = [];
    if (this.state.editing) {
      editingJSX.push(
        <button type="button" onClick={this.addRecipe} className="btn btn-primary" data-dismiss="modal">Save</button>
      );
    }
    else {
      editingJSX.push(
        <button type="button" onClick={this.addRecipe} className="btn btn-primary" data-dismiss="modal">Add Recipe</button>
      );
    }
    for (let i = 0; i < this.state.addedRecipes.length; i++) {
      var ingrJSX = [];
      let recipeName = Object.keys(this.state.addedRecipes[i])[0];
      let collapse = ["#collapse" + i,"collapse" + i];
      let nameJSX = [<a data-toggle="collapse" href={collapse[0]}>{recipeName}</a>];
      let recipeIngredients = this.state.addedRecipes[i][recipeName];
      for (let i = 0; i < recipeIngredients.length; i++) {
        ingrJSX.push(<li className="list-group-item">{recipeIngredients[i]}</li>);
      }
      finalJSX.push(
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              {nameJSX}
            </h3>
          </div>
          <div id={collapse[1]} className="panel-collapse collapse">
            <div className="container" id="recipe-container">
              <h4 className="ingredients-title">Ingredients</h4>
              <ul className="list-group">
                {ingrJSX}
              </ul>
              <button type="button" value={recipeName} onClick={this.editRecipe} className="btn btn-info change-recipe" data-toggle="modal" data-target="#myModal">Edit</button>
              <button type="button" value={recipeName} onClick={this.deleteRecipe} className="btn btn-danger change-recipe">Delete</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container" id="main">
        <div className="panel-group">
          {finalJSX}
        </div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#myModal">Add Recipe</button>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Add a Recipe</h4>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label for="inputsm">Recipe</label>
                    <input onChange={this.updateNextRecipeName} ref={(input) => { this.nameTextInput = input; }} className="form-control input-sm" id="inputsm" type="text" />
                  </div>
                  <div className="form-group">
                    <label for="inputlg">Ingredients</label>
                    <textarea onChange={this.updateNextRecipeIngr} ref={(input) => { this.ingrTextInput = input; }} className="form-control input-sm" rows="5" id="ingredients" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                {editingJSX}
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
