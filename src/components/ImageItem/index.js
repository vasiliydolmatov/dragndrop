import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Icon, Card, Button } from "antd";
import "./styles.scss";

export default class ImageItem extends React.Component {

  renderImage = () => {
    const { id, url, idx, isDeleted, changeDeletness } = this.props;

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
              className="draggable-remove-btn"
              onClick={() => {
                changeDeletness(id);
              }}
            />
          </div>
        )}
      </Draggable>
    );
  };

  renderAlert = () => {
    const { id, deleteItem, columnId, changeDeletness } = this.props;

    const arrayNameToDelete =
      columnId === "first_col" ? "firstColArr" : "secondColArr";

    return (
      <Card className="alert_card">
        <p>Are you sure?</p>
        <div className="alert_card-buttons">
          <Button
            type="default"
            onClick={() => changeDeletness(null)}
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
