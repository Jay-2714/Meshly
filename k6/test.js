import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '15m',
};

export default function () {


  const res_node = http.get('http://backend_node:4500/metrics', {
    tags: { service: 'node' },
  });

  check(res_node, {
    'node: status is 200': (r) => r.status === 200,
  });

  sleep(1);

  const res_rust = http.get('http://backend_rust:5000/metrics', {

    tags: { service: 'rust' },
  });

  check(res_rust, {
    'rust: status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
