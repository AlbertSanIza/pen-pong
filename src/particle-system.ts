interface Particle {
    x: number
    y: number
    dx: number
    dy: number
    life: number
    size: number
    color: string
}

export class ParticleSystem {
    ctx: CanvasRenderingContext2D
    particles: Particle[]
    colors: string[]

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context
        this.particles = []
        this.colors = ['oklch(0.685 0.169 237.323)', 'oklch(0.623 0.214 259.815)', 'oklch(0.546 0.245 262.881)']
    }

    createParticle(x: number, y: number, dx: number, dy: number, isExplosion = false): Particle {
        return {
            x: x,
            y: y,
            dx: isExplosion ? (Math.random() - 0.5) * 15 : (Math.random() - 0.5) * 2 + dx * 0.5,
            dy: isExplosion ? (Math.random() - 0.5) * 15 : (Math.random() - 0.5) * 2 + dy * 0.5,
            life: isExplosion ? 1.0 : 0.8,
            size: isExplosion ? Math.random() * 6 + 2 : 3,
            color: isExplosion ? this.colors[Math.floor(Math.random() * this.colors.length)] : `hsl(${Math.random() * 30 + 210}, 100%, 50%)`
        }
    }

    createExplosion(x: number, y: number, particleCount = 60) {
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle(x, y, 0, 0, true))
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i]
            p.x += p.dx
            p.y += p.dy
            p.life -= 0.02

            // Add gravity effect for explosion particles
            if (p.size > 3) {
                // Only affect explosion particles
                p.dy += 0.2
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1)
            }
        }
    }

    draw() {
        this.ctx.save()
        for (const particle of this.particles) {
            this.ctx.globalAlpha = particle.life
            this.ctx.fillStyle = particle.color

            // Add glow effect for explosion particles
            if (particle.size > 3) {
                this.ctx.shadowBlur = 15
                this.ctx.shadowColor = particle.color
            }

            this.ctx.beginPath()
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            this.ctx.fill()
        }
        this.ctx.restore()
    }
}
