import React from "react";
import { Card, Upload, Icon } from "antd";
import { Droppable } from "react-beautiful-dnd";
import shortid from "shortid";
import "antd/dist/antd.css";
import ImageItem from "./ImageItem";
import "./styles.scss";

export default class Column extends React.Component {
  state = {
    isDragEnter: false,
    isHovered: false
  };

  onDrop = uploaded => {
    const { columnId, saveImgToList } = this.props;
    const { file } = uploaded;

    if (file.status === "uploading") return null;

    const filePreview = {
      url: window.URL.createObjectURL(file.originFileObj),
      id: shortid.generate()
    };
    if (filePreview) {
      saveImgToList(filePreview, columnId);
    }
    this.setState({
      isDragEnter: false,
      isHovered: false
    });
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
        accept="image/*"
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
    const { list, deleteItem, columnId } = this.props;

    if (!list.length) return null;

    return list.map((img, idx) => {
      const { url, id } = img;
      return (
        <ImageItem
          url={url}
          id={id}
          idx={idx}
          deleteItem={deleteItem}
          columnId={columnId}
          key={id}
        />
      );
    });
  };

  onDragStart = () => {
    const { isDragOn } = this.props;
    if (!isDragOn) return null;
    this.setState({
      isHovered: true
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
                <p className="column-text">Drag your your file here</p>
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
