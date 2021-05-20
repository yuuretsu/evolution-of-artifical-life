import styled from 'styled-components';
import React from 'react';

interface IRoundButtonsGroup {
    readonly sidebarOpened: boolean;
};

const Wrapper = styled.div<IRoundButtonsGroup>`
    position: fixed;
    display: flex;
    background-color: #282828;
    padding: 10px;
    border-radius: 100px;
    box-shadow: 0 0 10px 0 black;
    top: 20px;
    left: 20px;
    & > *:not(:last-child) {
        margin-right: 10px;
    }
    transition-duration: 0.2s;
`;

type RoundButtonsGroupProps = {
    sidebarOpened: boolean;
    children?: React.ReactNode;
};

const RoundButtonsGroup = (props: RoundButtonsGroupProps) => {
    return (
        <Wrapper
            sidebarOpened={props.sidebarOpened}
        >{props.children}</Wrapper>
    );
};

export default RoundButtonsGroup;