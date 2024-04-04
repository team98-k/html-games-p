package com.game.team1.mapper;

import java.util.List;

import com.game.team1.vo.PointInfoVO;

public interface PointInfoMapper {
	List<PointInfoVO> selectPointInfos(PointInfoVO point);
	PointInfoVO selectPointInfo(int piNum);
	int insertPointInfo(PointInfoVO point);
	int updatePointInfo(PointInfoVO point);
	int deletePointInfo(int piNum);
}
