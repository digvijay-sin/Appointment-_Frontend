import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectLoginGuard } from './redirect-login.guard';

describe('redirectLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
