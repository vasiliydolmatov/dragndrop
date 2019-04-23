import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Icon, Card, Button } from "antd";
import "./styles.scss";

export default class ImageItem extends React.Component {
  state = {
    isDeleted: false
  };

  renderImage = () => {
    const { id, url, idx } = this.props;
    const { isDeleted } = this.state;
    return (
      <Draggable draggableId={id} index={idx} key={id}>
        {dragProvided => (
          <div
            className="draggable"
            ref={dragProvided.innerRef}
            {...dragProvided.dragHandleProps}
            {...dragProvided.draggableProps}
          >
            {isDeleted && this.renderAlert()}
            <img
                src={url}
                alt="img"
                style={{width: "100%", height: 150}}
            />
            {dragProvided.placeholder}
            <Icon
              type="delete"
              theme="filled"
              className="draggable-remove-btn"
              onClick={() => {
                this.setState({ isDeleted: true });
              }}
            />
          </div>
        )}
      </Draggable>
    );
  };

  renderAlert = () => {
    const { id, deleteItem, columnId } = this.props;

    const arrayNameToDelete =
      columnId === "first_col" ? "firstColArr" : "secondColArr";

    return (
      <Card className="alert_card">
        <p>Are you sure?</p>
        <div className="alert_card-buttons">
          <Button
            type="default"
            onClick={() => {
              this.setState({ isDeleted: false });
            }}
          >
            CANCEL
          </Button>
          <Button
            type="danger"
            onClick={() => deleteItem(arrayNameToDelete, id)}
          >
            DELETE
          </Button>
        </div>
      </Card>
    );
  };

  render() {
    return this.renderImage();
  }
}
