"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { Space, Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
const { Column, ColumnGroup } = Table;

import { apiClient as axios } from "../api/apiClient";

export default function User() {
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    try {
      const response = await axios.get("/get_user");
      const data = await response.data;
      setUsers(data);
    } catch (err) {
      alert(err);
      message.error("Failed to load cameras!");
    }finally {
      
    }
  }, []);
  return (
    <Table dataSource={users}>
      <ColumnGroup title="Name">
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
      </ColumnGroup>
      <Column title="Age" dataIndex="age" key="age" />
      <Column title="Address" dataIndex="address" key="address" />
      <Column
        title="Position"
        dataIndex="Position"
        key="Position"
        render={(position) => (
          <>
            {position.map((position) => {
              let color = position.length > 5 ? "geekblue" : "green";
              if (position === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={position}>
                  {position.toUpperCase()}
                </Tag>
              );
            })}
          </>
        )}
      />
      <Column
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle" className="flex justify-center items-center">
            <a className="text-[16px] h-[30px] w-[30px] border-[1.5px] border-solid  rounded-[50%] padding-[10px] flex justify-center items-center text-[red]">
              <DeleteOutlined />
            </a>
          </Space>
        )}
      />
    </Table>
  );
}
