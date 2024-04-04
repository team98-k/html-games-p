package com.game.team1.mapper;

import java.util.List;

import com.game.team1.vo.GameInfoVO;

public interface GameInfoMapper {
	List<GameInfoVO> selectGameInfos(GameInfoVO game);
	GameInfoVO selectGameInfo(int giNum);
	int insertGameInfo(GameInfoVO game);
	int updateGameInfo(GameInfoVO game);
	int deleteGameInfo(int giNum);
}
