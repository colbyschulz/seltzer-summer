import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Menu, Popover } from 'antd';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import colors from '../../colors';

interface SettingsPopoverProps {
  setActiveEditId: Dispatch<SetStateAction<number | null>>;
  setActiveDeleteId: Dispatch<SetStateAction<number | null>>;
  raceId?: number;
}

const SettingsPopover: FC<SettingsPopoverProps> = ({ setActiveEditId, setActiveDeleteId, raceId }) => {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  return (
    <StyledPopover
      overlayInnerStyle={{ padding: 0 }}
      open={isSettingsMenuOpen}
      onOpenChange={setIsSettingsMenuOpen}
      placement="left"
      content={
        <MenuWrapper
          selectable={false}
          items={[
            {
              label: 'edit',
              key: 'edit',
              icon: <EditOutlined />,
              onClick: () => {
                setActiveEditId(raceId ?? null);
                setIsSettingsMenuOpen(false);
              },
            },
            {
              label: 'delete',
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                setActiveDeleteId(raceId ?? null);
                setIsSettingsMenuOpen(false);
              },
            },
          ]}
        />
      }
      trigger="click"
    >
      <Button
        ghost
        style={{
          marginBottom: 0,
          padding: '2px 0px',
          width: 'auto',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }}
      >
        <MoreOutlined style={{ color: colors.black }} />
      </Button>
    </StyledPopover>
  );
};

export default SettingsPopover;

const StyledPopover = styled(Popover)``;

const MenuWrapper = styled(Menu)`
  border: none !important;
  min-width: 110px;

  .li {
    padding: 0;
  }
`;
