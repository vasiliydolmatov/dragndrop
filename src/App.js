import React, { Component } from "react";
import Column from "./components/Column/index";
import { DragDropContext } from "react-beautiful-dnd";
import { notification } from "antd";

const notificationDescr = `
You have exceeded the limit of possible images in the column. 
Please delete the picture to add a new one.
`;

class App extends Component {
  state = {
    firstColArr: [],
    secondColArr: [],
    isDragOn: false
  };

  checkArrayLength = id => {
    const { firstColArr, secondColArr } = this.state;

    const currentArray = id === "first_col" ? firstColArr : secondColArr;

    return currentArray.length >= 10 ? false : true;
  };

  onDragEnd = event => {
    const { destination, source } = event;
    let { firstColArr, secondColArr } = this.state;

    if (!destination) return null;

    if (destination.droppableId === source.droppableId) {
      const currentArr =
        destination.droppableId === "first_col" ? firstColArr : secondColArr;
      const [part] = currentArr.splice(source.index, 1);
      currentArr.splice(destination.index, 0, part);
      this.setState(() => {
        return destination.droppableId === "first_col"
          ? { firstColArr: currentArr }
          : { secondColArr: currentArr };
      });
      return null;
    }

    if (source.droppableId === "first_col") {
      const [part] = firstColArr.splice(source.index, 1);
      secondColArr.splice(destination.index, 0, part);
    } else {
      const [part] = secondColArr.splice(source.index, 1);
      firstColArr.splice(destination.index, 0, part);
    }

    this.setState({
      firstColArr,
      secondColArr
    });
  };

  saveImgToList = (img, id) => {
    const isArrayLengthMoreThanTen = this.checkArrayLength(id);

    if (!isArrayLengthMoreThanTen) {
      notification.open({
        message: "Watch out!",
        description: notificationDescr,
        duration: 3
      });
      return null;
    }

    this.setState(({ firstColArr, secondColArr }) => ({
      firstColArr: id === "first_col" ? firstColArr.concat([img]) : firstColArr,
      secondColArr:
        id === "second_col" ? secondColArr.concat([img]) : secondColArr
    }));
  };

  deleteItem = (arrayName, itemId) => {
    this.setState({
      [arrayName]: this.state[arrayName].filter(el => el.id !== itemId)
    });
  };

  changeDeletness = (itemId) => {
    this.setState(({ firstColArr, secondColArr }) => ({
      firstColArr: this.changeIsDeletedProp(firstColArr, itemId),
      secondColArr: this.changeIsDeletedProp(secondColArr, itemId),
    }))
  }

  changeIsDeletedProp = (arr, id) => {
    return arr.map(el => {
      return {
        ...el,
        isDeleted: el.id === id ? true : false,
      }
    })
  }

  render() {
    const { firstColArr, secondColArr, isDragOn } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="App">
          <Column
            columnId="first_col"
            saveImgToList={this.saveImgToList}
            list={firstColArr}
            isDragOn={isDragOn}
            deleteItem={this.deleteItem}
            changeDeletness={this.changeDeletness}
          />
          <Column
            columnId="second_col"
            saveImgToList={this.saveImgToList}
            list={secondColArr}
            isDragOn={isDragOn}
            deleteItem={this.deleteItem}
            changeDeletness={this.changeDeletness}
          />
        </div>
      </DragDropContext>
    );
  }
}

export default App;
