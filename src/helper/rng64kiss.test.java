public class RNGKiss64 {


	private long kiss64_x = 1234567890987654321l;
	private long kiss64_c = 123456123456123456l;
	private long kiss64_y = 362436362436362436l;
	private long kiss64_z = 1066149217761810l;
	private long kiss64_t = 0;

	public RNGKiss64() {
	}

	public RNGKiss64(long seed) {
		seed(seed);
	}

	public void seed(long seed) {

		kiss64_x = seed | 1;
		kiss64_c = seed | 2;
		kiss64_y = seed | 4;
		kiss64_z = seed | 8;
		kiss64_t = 0;

	}

	public long random(int in) {

		// multiply with carry
		this.echo("before");
		kiss64_t = (kiss64_x << 58) + kiss64_c;
		this.echo("after step 1");
		kiss64_c = (kiss64_x >>> 6);   // unsigned right shift
		this.echo("after step 2");
		kiss64_x += kiss64_t;
		this.echo("after step 3");


		//kiss64_c += (kiss64_x < kiss64_t)?1l:0l;

		kiss64_c += Long.compareUnsigned(kiss64_x, kiss64_t) < 0 ? 1l:0l;
		this.echo("after step 4");


		// XOR shift
		kiss64_y ^= (kiss64_y << 13);
		this.echo("after step 5");
		kiss64_y ^= (kiss64_y >>> 17);  // unsigned right shift
		this.echo("after step 6");
		kiss64_y ^= (kiss64_y << 43);
		this.echo("after step 7");

		// Congruential
		kiss64_z = 6906969069l * kiss64_z + 1234567l;
		this.echo("after step 8");
		long rand = kiss64_x + kiss64_y + kiss64_z;
		this.echo("after step 9: rand = " + rand);

		if (in == 0) {
			return rand;
		} else {
			return ((rand & 0xFFFFFFFFl) * in) >>> 32;  // unsigned right shift;
		}

	}

	public void echo(String log) {
	    System.out.println("[" + log + "] kiss64_x = " + this.kiss64_x + "; kiss64_c = " + this.kiss64_c + "; kiss64_y = " + this.kiss64_y + "; kiss64_z = " + this.kiss64_z + "; kiss64_t = " + this.kiss64_t + ".");
	}

	public static void main(String[] args) {

	  RNGKiss64 rng = new RNGKiss64();
      rng.seed(1);
        for (int i = 1; i <= 10; i++) {
      System.out.println("Sum of x+y = " + rng.random(32));
        }
    }
}
