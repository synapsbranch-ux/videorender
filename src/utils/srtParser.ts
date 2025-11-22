import Parser from 'srt-parser-2';

export interface LyricLine {
	id: string;
	startTime: string;
	startSeconds: number;
	endTime: string;
	endSeconds: number;
	text: string;
}

export const parseSrt = (srtContent: string): LyricLine[] => {
	const parser = new Parser();
	const srtArray = parser.fromSrt(srtContent);

	return srtArray.map((line) => ({
		id: line.id,
		startTime: line.startTime,
		startSeconds: line.startSeconds,
		endTime: line.endTime,
		endSeconds: line.endSeconds,
		text: line.text,
	}));
};