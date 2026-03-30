import { analyzeFeedback } from '../src/services/gemini.service';

jest.mock('../src/services/gemini.service', () => ({
  analyzeFeedback: jest.fn((_title: string, _description: string) =>
    Promise.resolve({
      category: 'Bug',
      sentiment: 'Positive',
      priority_score: 1,
      summary: 'Mocked summary',
      tags: [],
    })
  ),
}));

describe('Gemini service', () => {
  it('parses feedback correctly', async () => {
    const result = await analyzeFeedback('Bug title', 'Bug description');
    expect(result?.category).toBe('Bug');
    expect(result?.summary).toBe('Mocked summary');
  });
});