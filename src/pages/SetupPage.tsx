import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Typography, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useGameStore } from '../store/gameStore';
import { defaultStoryContext } from '../contexts';
import GameScreen from '../components/GameScreen';

const { Title, Paragraph } = Typography;

const guideText = `
# 故事背景模板

## 1. 世界观设定 (World Setting)
描述你的故事发生的地点、时代、独特的社会规则或核心概念。

## 2. 玩家角色设定 (Your Character)
描述玩家扮演的角色。他的姓名、身份、性格、目标或特殊能力。

## 3. 主要人物 (Main Characters)
列出故事中的主要角色，特别是玩家可以互动的角色。

## 4. 开局场景 (Opening Scene)
描述游戏开始时的具体情景。这会是 AI 生成第一幕画面的直接依据。
`;

const GuideTooltipContent = styled.div`
  white-space: pre-wrap;
  max-width: 400px;
`;

const SetupContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  color: #333;
`;

const CenteredLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
`;

const StyledTextArea = styled(Input.TextArea)`
  background: rgba(240, 240, 240, 0.95) !important;
  border-color: #ccc !important;
  color: #333 !important;
  font-size: 1rem !important;
  font-family: var(--font-family-sans) !important;
`;

const StyledButton = styled(Button)`
  margin-top: 24px;
  background: linear-gradient(145deg, #89cff0, #4682b4);
  border: none;
  color: white;
  font-weight: bold;

  &:hover:not(:disabled) {
    background: linear-gradient(145deg, #a1d9f2, #5a9ac6);
    color: white !important;
    box-shadow: 0 0 15px rgba(137, 207, 240, 0.8);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const SetupPage = () => {
  const [context, setContext] = useState(defaultStoryContext.trim());
  const startGame = useGameStore((state) => state.startGame);
  const navigate = useNavigate();

  const handleStart = () => {
    if (context.trim()) {
      startGame(context.trim());
      navigate('/game');
    }
  };

  return (
    <GameScreen backgroundImage="/assets/images/backgrounds/school_gate.png">
      <CenteredLayout>
        <SetupContainer>
          <TitleContainer>
            <Title level={2} style={{ color: '#2c3e50', margin: 0 }}>故事设定</Title>
            <Tooltip title={<GuideTooltipContent>{guideText}</GuideTooltipContent>}>
              <QuestionCircleOutlined style={{ color: '#597a96', fontSize: '20px', cursor: 'help' }} />
            </Tooltip>
          </TitleContainer>
          <Paragraph style={{ color: '#597a96' }}>
            在这里定义你的故事背景、角色以及开场。AI 将会以此为基础，为你演绎一场独一无二的邂逅。
          </Paragraph>
          <StyledTextArea
            rows={15}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <StyledButton
            type="primary"
            size="large"
            onClick={handleStart}
          >
            开启故事
          </StyledButton>
        </SetupContainer>
      </CenteredLayout>
    </GameScreen>
  );
};

export default SetupPage;
