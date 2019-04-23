import React from "react";
import { Card, Upload, Icon, notification } from "antd";
import { Droppable } from "react-beautiful-dnd";
import shortid from "shortid";
import "antd/dist/antd.css";
import ImageItem from "../ImageItem";
import "./styles.scss";

export default class Column extends React.Component {
  state = {
    isDragEnter: false
  };

  onDrop = uploaded => {
    const { columnId, saveImgToList } = this.props;
    const { file } = uploaded;

    if (file.status === "uploading") return null;

    if (!file.type || file.type.indexOf("image/") === -1) {
      notification.open({
        message: "Wrong file format!",
        duration: 3
      });
      this.setState({
        isDragEnter: false
      });
      return null;
    }

    this.setState({
      isDragEnter: false
    });

    const filePreview = {
      url: window.URL.createObjectURL(file.originFileObj),
      id: shortid.generate(),
      isDeleted: false
    };
    if (filePreview) {
      saveImgToList(filePreview, columnId);
    }
    return null;
  };

  onDragEnter = e => {
    e.preventDefault();
    this.setState({
      isDragEnter: true
    });
  };

  onDragLeave = e => {
    e.preventDefault();
    this.setState({
      isDragEnter: false
    });
  };

  renderDropzone = () => (
    <div onDragLeave={this.onDragLeave}>
      <Upload.Dragger
        className="dropzone"
        onChange={this.onDrop}
        showUploadList={false}
        openFileDialogOnClick={false}
      >
        <Icon type="inbox" />
        Upload your files here
      </Upload.Dragger>
    </div>
  );

  renderImagesList = () => {
    const { list, deleteItem, columnId, changeDeletness } = this.props;

    if (!list.length) return null;

    return list.map((img, idx) => {
      const { url, id, isDeleted } = img;
      return (
        <ImageItem
          url={url}
          id={id}
          idx={idx}
          deleteItem={deleteItem}
          columnId={columnId}
          key={id}
          isDeleted={isDeleted}
          changeDeletness={changeDeletness}
        />
      );
    });
  };

  render() {
    const { columnId, list } = this.props;
    const { isDragEnter } = this.state;

    return (
      <Card className="column" onDragOver={this.onDragEnter}>
        {isDragEnter && this.renderDropzone()}
        <Droppable droppableId={columnId}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="droppable"
            >
              {!isDragEnter && !list.length && (
                <p className="column-text">Drag your file here</p>
              )}
              {this.renderImagesList()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card>
    );
  }
}
