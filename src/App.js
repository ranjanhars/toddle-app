import React, { useState, useEffect } from "react";
import "./App.css";
import image from "./giftbox.png";
import picture from "./chevron.png";
import linkImage from "./link.png";
import pdfImage from "./adobe.png";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DownloadIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

Modal.setAppElement("#root");

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [modules, setModules] = useState(() => {
    const storedModules = localStorage.getItem("modules");
    return storedModules ? JSON.parse(storedModules) : [];
  });
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkName, setLinkName] = useState("");

  useEffect(() => {
    const storedModules = localStorage.getItem("modules");
    if (storedModules) {
      setModules(JSON.parse(storedModules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("modules", JSON.stringify(modules));
  }, [modules]);

  const handleCreateModuleClick = () => {
    setShowModal(true);
    setShowDropdown(false);
  };

  const handleAddLinkClick = () => {
    setShowLinkModal(true);
    setShowDropdown(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModuleName("");
    setEditIndex(null);
    setEditType(null);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setLinkURL("");
    setLinkName("");
    setEditIndex(null);
    setEditType(null);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setModuleName("");
    setEditIndex(null);
    setEditType(null);
  };

  const handleInputChange = (e) => {
    setModuleName(e.target.value);
  };

  const handleLinkInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "linkURL") {
      setLinkURL(value);
    } else if (name === "linkName") {
      setLinkName(value);
    }
  };

  const handleCreateButtonClick = () => {
    if (moduleName.trim() !== "") {
      if (editIndex !== null && editType === "module") {
        const updatedModules = [...modules];
        updatedModules[editIndex] = {
          ...updatedModules[editIndex],
          name: moduleName,
        };
        setModules(updatedModules);
      } else {
        setModules([
          ...modules,
          { id: Date.now(), name: moduleName, type: "module" },
        ]);
      }
      closeModal();
    }
  };

  const handleAddLinkButtonClick = () => {
    if (linkURL.trim() !== "" && linkName.trim() !== "") {
      if (editIndex !== null && editType === "link") {
        const updatedModules = [...modules];
        updatedModules[editIndex] = {
          ...updatedModules[editIndex],
          name: linkName,
          url: linkURL,
        };
        setModules(updatedModules);
      } else {
        setModules([
          ...modules,
          { id: Date.now(), name: linkName, url: linkURL, type: "link" },
        ]);
      }
      closeLinkModal();
    }
  };

  const handleUploadButtonClick = () => {
    if (selectedFile) {
      if (editIndex !== null && editType === "file") {
        const updatedModules = [...modules];
        updatedModules[editIndex] = {
          ...updatedModules[editIndex],
          name: moduleName,
          file: selectedFile,
        };
        setModules(updatedModules);
      } else {
        setModules([
          ...modules,
          {
            id: Date.now(),
            name: moduleName,
            type: "file",
            file: selectedFile,
          },
        ]);
      }
      closeUploadModal();
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleDeleteMenu = (id) => {
    setShowDeleteMenu(showDeleteMenu === id ? null : id);
  };

  const deleteModule = (id) => {
    setModules(modules.filter((module) => module.id !== id));
    setShowDeleteMenu(null);
  };

  const editModule = (id) => {
    const index = modules.findIndex((module) => module.id === id);
    if (index !== -1) {
      if (modules[index].type === "module") {
        setModuleName(modules[index].name);
        setShowModal(true);
      } else if (modules[index].type === "link") {
        setLinkURL(modules[index].url);
        setLinkName(modules[index].name);
        setShowLinkModal(true);
      } else if (modules[index].type === "file") {
        setModuleName(modules[index].name);
        setSelectedFile(modules[index].file);
        setShowUploadModal(true);
      }
      setEditIndex(index);
      setEditType(modules[index].type);
      setShowDeleteMenu(null);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedModules = Array.from(modules);
    const [reorderedModule] = updatedModules.splice(result.source.index, 1);
    updatedModules.splice(result.destination.index, 0, reorderedModule);

    setModules(updatedModules);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="left-content">
          <p>CourseBuilder</p>
        </div>
        <div className="right-content">
          <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
              <span className="icon">+</span> Add{" "}
              <span className="arrow">▼</span>
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li className="dropdown-item" onClick={handleCreateModuleClick}>
                  <span className="icon">📁</span> Create module
                </li>
                <li className="dropdown-item" onClick={handleAddLinkClick}>
                  <span className="icon">🔗</span> Add a link
                </li>
                <li
                  className="dropdown-item"
                  onClick={() => {
                    setShowUploadModal(true);
                    setEditIndex(null);
                    setEditType("file");
                    setSelectedFile(null);
                    setModuleName("");
                  }}
                >
                  <span className="icon">⬆</span> Upload
                </li>
              </ul>
            )}
          </div>
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <div className="modal-header">
                  <h2>
                    {editIndex !== null ? "Edit module" : "Create new module"}
                  </h2>
                  <button onClick={closeModal}>X</button>
                </div>
                <div className="modal-body">
                  <label>
                    Module name
                    <input value={moduleName} onChange={handleInputChange} />
                  </label>
                </div>
                <div className="modal-footer">
                  <button onClick={closeModal}>Cancel</button>
                  <button onClick={handleCreateButtonClick}>
                    {editIndex !== null ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showLinkModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <div className="modal-header">
                  <h2>{editIndex !== null ? "Edit link" : "Add a Link"}</h2>
                  <button onClick={closeLinkModal}>X</button>
                </div>
                <div className="modal-body">
                  <label>
                    URL
                    <input
                      name="linkURL"
                      value={linkURL}
                      onChange={handleLinkInputChange}
                    />
                  </label>
                  <label>
                    Display Name
                    <input
                      name="linkName"
                      value={linkName}
                      onChange={handleLinkInputChange}
                    />
                  </label>
                </div>
                <div className="modal-footer">
                  <button onClick={closeLinkModal}>Cancel</button>
                  <button onClick={handleAddLinkButtonClick}>
                    {editIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showUploadModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <div className="modal-header">
                  <h2>{editIndex !== null ? "Edit file" : "Upload a file"}</h2>
                  <button onClick={closeUploadModal}>X</button>
                </div>
                <div className="modal-body">
                  <label>
                    File name
                    <input value={moduleName} onChange={handleInputChange} />
                  </label>
                  <label>
                    Select file
                    <input type="file" onChange={handleFileChange} />
                  </label>
                </div>
                <div className="modal-footer">
                  <button onClick={closeUploadModal}>Cancel</button>
                  <button onClick={handleUploadButtonClick}>
                    {editIndex !== null ? "Update" : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className={`App-main ${modules.length > 0 ? "modules-exist" : ""}`}>
        {modules.length === 0 ? (
          <div className="empty-state">
            <img src={image} alt="logo" className="empty-state-image" />
            <p className="empty-state-text">Nothing added here yet</p>
            <p className="empty-state-subtext">
              Click on the [+] Add button to add items to this course
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div
                  className="module-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <ul>
                    {modules.map((module, index) => (
                      <Draggable
                        key={module.id}
                        draggableId={module.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="module-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="intro">
                              <i class="uil uil-draggabledots"></i>
                              <span className="icon">
                                <img
                                  src={
                                    module.type === "link"
                                      ? linkImage
                                      : module.type === "file"
                                      ? pdfImage
                                      : picture
                                  }
                                  alt="logo"
                                />
                              </span>
                              <div>
                                {module.type === "link" && (
                                  <a
                                    href={module.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {module.name}
                                  </a>
                                )}
                                {module.type === "module" && (
                                  <span className="module-name">
                                    {module.name}
                                  </span>
                                )}
                                {module.type === "file" && (
                                  <span className="module-name">
                                    {module.name}
                                  </span>
                                )}

                                <div className="light-text">
                                  {module.type === "link"
                                    ? "link"
                                    : module.type === "module"
                                    ? "Add item to this module"
                                    : module.type === "file"
                                    ? "PDF"
                                    : ""}
                                </div>
                              </div>
                            </div>
                            <div className="module-options">
                              <button
                                onClick={() => toggleDeleteMenu(module.id)}
                              >
                                ⋮
                              </button>
                              {showDeleteMenu === module.id && (
                                <div className="delete-menu">
                                  <button onClick={() => editModule(module.id)}>
                                  <span className="download-wrapper">
                                        <Pencil1Icon className="size-4" />
                                        <span className="download-text">
                                          Edit
                                        </span>
                                      </span>
                                  </button>
                                  <button
                                    onClick={() => deleteModule(module.id)}
                                  >
                                   <span className="download-wrapper">
                                        <TrashIcon className="size-4" />
                                        <span className="download-text">
                                          delete
                                        </span>
                                      </span>
                                  </button>
                                  {module.file && (
                                    <button
                                      onClick={() => downloadFile(module.file)}
                                    >
                                      <span className="download-wrapper">
                                        <DownloadIcon className="size-4" />
                                        <span className="download-text">
                                          Download
                                        </span>
                                      </span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>
    </div>
  );
}

export default App;
