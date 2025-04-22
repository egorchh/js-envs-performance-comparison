import { runCodeAsync } from '../../api';
import { Settings } from '../../types';

// Автоматически используем мок из __mocks__/api.ts
jest.mock('../../api');

describe('API module', () => {
  const mockResponse = {
    status: 'success',
    data: {
      node: {
        executionTime: 100,
        output: 'Node output'
      },
      deno: {
        executionTime: 150,
        output: 'Deno output'
      },
      bun: {
        executionTime: 80,
        output: 'Bun output'
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (runCodeAsync as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('should call API with correct parameters', async () => {
    const code = 'console.log("test")';
    const settings: Settings = {
      environments: {
        node: true,
        deno: true,
        bun: true
      },
      timeout: 5000,
      runs: 3,
      mode: 'single'
    };

    const result = await runCodeAsync({ code, settings });

    expect(result).toEqual(mockResponse);
    expect(runCodeAsync).toHaveBeenCalledTimes(1);
    expect(runCodeAsync).toHaveBeenCalledWith({ code, settings });
  });

  it('should handle error responses', async () => {
    const errorResponse = {
      status: 'error',
      error: 'Test error'
    };
    
    (runCodeAsync as jest.Mock).mockResolvedValueOnce(errorResponse);
    
    const code = 'invalid code';
    const settings: Settings = {
      environments: {
        node: true,
        deno: false,
        bun: false
      },
      timeout: 3000,
      runs: 1,
      mode: 'single'
    };

    const result = await runCodeAsync({ code, settings });

    expect(result).toEqual(errorResponse);
    expect(runCodeAsync).toHaveBeenCalledTimes(1);
  });
}); 