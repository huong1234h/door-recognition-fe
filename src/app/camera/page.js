"use client";

import { apiClient as axios } from "../api/apiClient";

import { PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload,
} from "antd";
import { useState } from "react";
import "./index.css";
const style = {
  borderRadius: "15px",
  padding: "8px",
};
const text = <span>Add user</span>;

const { Search } = Input;

export default function Camera() {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCamOpen, setIsModalCamOpen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [newCamera, setNewCamera] = useState({ name: "", ip: "" });
  const [loading, setLoading] = useState(false);
  const [filteredCameras, setFilteredCameras] = useState(cameras);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    age: null,
    avatar: "",
    ipAddress: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAvatarUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setUserData((prev) => ({
          ...prev,
          avatar: base64,
        }));
        resolve();
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  useEffect(() => {
    setFilteredCameras(cameras);
  }, [cameras]);
  useEffect(() => {
    const fetchCameras = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/"
        );
        setCameras(response.data); // Giả định API trả về danh sách camera dạng mảng
      } catch (error) {
        console.error("Error fetching cameras:", error);
        message.error("Failed to load cameras!");
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  const handleOpenDoor = async (ip) => {
    try {
      await axios.post(`http://${ip}/open`); // Đổi <arduino-ip-address> thành IP của Arduino
      message.success("Door opened successfully!");
    } catch (error) {
      console.error("Error opening door:", error);
      message.error("Failed to open door.");
    }
  };
  const handleCloseDoor = async (ip) => {
    try {
      await axios.post(`http://${ip}/close`);
      message.success("Door closed successfully!");
    } catch (error) {
      console.error("Error closing door:", error);
      message.error("Failed to close door.");
    }
  };

  const handleAddCamera = async () => {
    if (newCamera.name && newCamera.ip) {
      try {
        const response = await axios.post(
          "/new-camera",
          newCamera
        );
        setCameras([...cameras, response.data]); // Thêm camera mới vào danh sách
        setNewCamera({ name: "", ip: "" });
        setIsModalCamOpen(false);
        message.success("Camera added successfully!");
      } catch (error) {
        console.error("Error adding camera:", error);
        message.error("Failed to add camera!");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  const showModal = (ip) => {
    setUserData((prev) => ({ ...prev, ipAddress:ip }));
    setIsModalOpen(true);
  };
  const showModalCam = () => {
    setIsModalCamOpen(true);
  };

  const handleCancelCam = () => {
    setIsModalCamOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSaveUser = async () => {
    try {
      // Kiểm tra dữ liệu nhập hợp lệ trước khi gửi
      if (!userData.firstName || !userData.lastName || !userData.email) {
        message.error("Please fill in all required fields.");
        return;
      }

      // Gửi dữ liệu lên server
      const response = await axios.post(
        "/register",
        userData
      );
      message.success("User added successfully!");
      setIsModalOpen(false);
      // Reset dữ liệu
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        age: null,
        avatar: "",
        ipAddress:""
      });
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Failed to save user.");
    }
  };
  const onSearch = (value) => {
    const filtered = cameras.filter((camera) =>
      camera.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCameras(filtered);
  };

  return (
    <div>
      <Modal
        title="Add Camera"
        open={isModalCamOpen}
        onOk={handleAddCamera}
        onCancel={handleCancelCam}
        okText="Add"
      >
        <Form layout="vertical" style={{ width: "fit-content" }}>
          <Form.Item label="Camera Name" className="flex flex-col w-[60vw]">
            <Input
              name="name"
              placeholder="Enter camera name"
              value={newCamera.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="IP Address">
            <Input
              name="ip"
              placeholder="Enter IP Address"
              value={newCamera.ip}
              onChange={handleInputChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add user"
        open={isModalOpen}
        onOk={handleSaveUser}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="First name">
            <Input
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Last name">
            <Input
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Position">
            <Select
              value={userData.position}
              onChange={(value) =>
                setUserData((prev) => ({ ...prev, position: value }))
              }
            >
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Age">
            <InputNumber
              value={userData.age}
              onChange={(value) =>
                setUserData((prev) => ({ ...prev, age: value }))
              }
            />
          </Form.Item>
          <Form.Item
            label="Avatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={({ file, onSuccess }) => {
                handleAvatarUpload(file).then(() => onSuccess("done"));
              }}
              listType="picture-card"
              showUploadList={false}
            >
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <div className="border-b-solid border-b-[1px] border-b-[#ccc] p-[10px] flex justify-between items-center pb-[20px]">
        <Search
          style={{ width: "250px", height: "40px" }}
          size="large"
          placeholder="input search text"
          onSearch={onSearch}
          enterButton="Search"
        />
        <Button
          onClick={showModalCam}
          className="h-[40px] w-[100px] flex justify-center items-center"
          type="primary"
          icon={<PlusOutlined />}
          iconPosition="end"
        >
          Add
        </Button>
      </div>
      <Divider orientation="left">Quản lý camera</Divider>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredCameras.map((camera, index) => (
            <Col
              key={index}
              className="py-[5px] gutter-row h-fit flex justify-center items-center w-[195px] flex-col"
              span={6}
            >
              <div className="font-[500] py-[10px]">{camera.name}</div>
              <div
                style={style}
                className="h-[350px] shadow-md w-full flex flex-col gap-[10px]"
              >
                <div className="flex flex-row justify-evenly items-center">
                  <div className="text-center w-full">Status: Offline</div>
                  <Tooltip placement="topLeft" title={text} arrow>
                    <PlusCircleFilled
                      onClick={() => {
                        showModal(camera.ip);
                      }}
                      style={{ fontSize: "30px", color: "rgba(0,0,0,0.5)" }}
                    />
                  </Tooltip>
                </div>
                <video
                  playsInline
                  controls
                  src={`http://${camera.ipAddress}/stream`}
                  autoPlay
                  className="w-full h-[200px]"
                />
                <div className="p-[10px] flex justify-evenly">
                  <button
                    onClick={()=>{handleOpenDoor(camera.ipAddress)}}
                    className="open w-[50px] h-[40px] bg-green-500 rounded-[10px] text-white"
                  >
                    Open
                  </button>
                  <button
                    onClick={()=>{handleCloseDoor(camera.ipAddress)}}
                    className="close w-[50px] h-[40px] bg-red-500 rounded-[10px] text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}
