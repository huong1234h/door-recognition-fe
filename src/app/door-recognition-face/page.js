"use client";

import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

export default function DoorRecognitionFace() {
  const [form] = Form.useForm();
  const [cameraInfo, setCameraInfo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        message.success("Face detection models loaded.");
      } catch (err) {
        console.error("Error loading models:", err);
        message.error("Failed to load face detection models.");
      }
    };
    loadModels();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `http://your-api-server.com/api/cameras/${ipAddress}`
      );
      const { name, ip } = response.data;

      if (name && ip) {
        setCameraInfo({ name, ip });
        setIsModalVisible(true);
        message.success("Camera found!");
      } else {
        message.error("Camera not found in the system.");
      }
    } catch (error) {
      console.error("Error fetching camera:", error);
      message.error("Camera not found in the system.");
    }
  };

  const handleFaceDetection = async () => {
    try {
      const detectionInterval = setInterval(async () => {
        // Check for face detection using face-api.js
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length > 0) {
          clearInterval(detectionInterval);
          message.success("Face detected, capturing image...");

          // Call the ESP32-CAM's capture endpoint to get the image
          const captureResponse = await axios.get(
            `http://${cameraInfo.ipAddress}/capture`,
            {
              responseType: "arraybuffer",
            }
          );

          // Convert the captured image to Base64
          const base64Image = `data:image/jpeg;base64,${btoa(
            new Uint8Array(captureResponse.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          )}`;

          // Send the Base64 image to the server for recognition
          const recognitionResponse = await axios.post(
            "/face-recognize",
            { image: base64Image ,
                ipAddress:ipAddress
            }
          );

          if (recognitionResponse.data.success) {
            message.success("Face recognized, opening door...");
            await axios.post(`http://${cameraInfo.ipAddress}/open`);
          } else {
            message.error("Face recognition failed.");
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Error during face detection:", error);
      message.error("Failed to process face detection.");
    }
  };

  return (
    <div>
      {/* Camera IP Form */}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Camera IP"
          name="ip"
          rules={[
            { required: true, message: "Please enter the camera IP address!" },
          ]}
        >
          <Input
            placeholder="Enter camera IP address"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Check Camera
          </Button>
        </Form.Item>
      </Form>

      {/* Modal for Camera Stream */}
      <Modal
        title={`Camera Stream - ${cameraInfo?.name || ""}`}
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width="80%"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          controls
          style={{ width: "100%", height: "auto" }}
          src={`http://${cameraInfo?.ipAdress}/stream`}
          onPlay={handleFaceDetection}
        />
      </Modal>
    </div>
  );
}
