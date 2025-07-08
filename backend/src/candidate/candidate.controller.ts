import { Controller, Headers, Logger, Post } from '@nestjs/common';
import { CandidateService } from './candidate.service';

@Controller('candidate')
export class CandidateController {
  private logger = new Logger('Candidate controller');
  constructor(private candidateService: CandidateService) {}

  @Post('generate')
  async generate(@Headers('x-client-id') clientId: string): Promise<any> {
    this.logger.verbose(`Client "${clientId}" generating new candidates}`);
    return this.candidateService.generate(clientId);
  }
}
